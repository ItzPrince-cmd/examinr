import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Hand,
  Phone,
  Settings,
  MoreVertical,
  Send,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { toast } from '../components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import batchService from '../services/batchService';

interface Participant {
  userId: string;
  userName: string;
  role: 'teacher' | 'student';
  socketId: string;
  stream?: MediaStream;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  hasRaisedHand: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

const LiveClassroom: React.FC = () => {
  const { batchId, sessionId } = useParams<{ batchId: string; sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, { transports: ['websocket', 'polling'] });
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      // Join the live session
      newSocket.emit('join-live-session', {
        sessionId,
        batchId,
        userId: user?.id,
        role: user?.role
      });
    });
    
    newSocket.on('participant-joined', handleParticipantJoined);
    newSocket.on('participant-left', handleParticipantLeft);
    newSocket.on('offer', handleOffer);
    newSocket.on('answer', handleAnswer);
    newSocket.on('ice-candidate', handleIceCandidate);
    newSocket.on('new-chat-message', handleNewMessage);
    newSocket.on('screen-share-started', handleScreenShareStarted);
    newSocket.on('screen-share-stopped', handleScreenShareStopped);
    newSocket.on('hand-raised', handleHandRaised);
    newSocket.on('hand-lowered', handleHandLowered);
    
    return () => {
      newSocket.emit('leave-live-session', { sessionId, userId: user?.id });
      newSocket.disconnect();
    };
  }, [sessionId, batchId, user]);
  // Initialize local media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Media Access Error",
          description: "Could not access camera or microphone",
          variant: "destructive"
        });
      }
    };

    initializeMedia();
    
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);
  // WebRTC handlers
  const handleParticipantJoined = useCallback(({ userId, role, socketId }: any) => {
    const participant: Participant = {
      userId,
      userName: `User ${userId.slice(-4)}`, // TODO: Get actual name
      role,
      socketId,
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      hasRaisedHand: false
    };

    setParticipants(prev => new Map(prev).set(socketId, participant));
    
    // Create peer connection for new participant
    if (localStream && socket) {
      createPeerConnection(socketId);
    }
  }, [localStream, socket]);
  const handleParticipantLeft = useCallback(({ socketId }: any) => {
    setParticipants(prev => {
      const newMap = new Map(prev);
      newMap.delete(socketId);
      return newMap;
    });
    
    // Close peer connection
    const peerConnection = peerConnectionsRef.current.get(socketId);
    if (peerConnection) {
      peerConnection.close();
      peerConnectionsRef.current.delete(socketId);
    }
  }, []);
  const createPeerConnection = async (targetSocketId: string) => {
    if (!socket || !localStream) return;
    
    const peerConnection = new RTCPeerConnection(iceServers);
    peerConnectionsRef.current.set(targetSocketId, peerConnection);
    
    // Add local stream tracks
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    // Handle incoming stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setParticipants(prev => {
        const newMap = new Map(prev);
        const participant = newMap.get(targetSocketId);
        if (participant) {
          participant.stream = remoteStream;
          newMap.set(targetSocketId, participant);
        }
        return newMap;
      });
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          sessionId,
          candidate: event.candidate,
          targetSocketId
        });
      }
    };
    
    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', { sessionId, offer, targetSocketId });
  };

  const handleOffer = async ({ offer, senderSocketId }: any) => {
    if (!socket || !localStream) return;
    
    const peerConnection = new RTCPeerConnection(iceServers);
    peerConnectionsRef.current.set(senderSocketId, peerConnection);
    
    // Add local stream tracks
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    // Handle incoming stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setParticipants(prev => {
        const newMap = new Map(prev);
        const participant = newMap.get(senderSocketId);
        if (participant) {
          participant.stream = remoteStream;
          newMap.set(senderSocketId, participant);
        }
        return newMap;
      });
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          sessionId,
          candidate: event.candidate,
          targetSocketId: senderSocketId
        });
      }
    };
    
    // Set remote description and create answer
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', { sessionId, answer, targetSocketId: senderSocketId });
  };

  const handleAnswer = async ({ answer, senderSocketId }: any) => {
    const peerConnection = peerConnectionsRef.current.get(senderSocketId);
    if (peerConnection) {
      await peerConnection.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = async ({ candidate, senderSocketId }: any) => {
    const peerConnection = peerConnectionsRef.current.get(senderSocketId);
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  };

  // Media controls
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!socket) return;
    
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach(peerConnection => {
          const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        videoTrack.onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
        socket.emit('start-screen-share', { sessionId, userId: user?.id });
      } catch (error) {
        console.error('Error sharing screen:', error);
        toast({
          title: "Screen Share Error",
          description: "Could not start screen sharing",
          variant: "destructive"
        });
      }
    } else {
      // Stop screen share and switch back to camera
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach(peerConnection => {
          const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
          if (sender && videoTrack) {
            sender.replaceTrack(videoTrack);
          }
        });
      }
      
      setIsScreenSharing(false);
      socket.emit('stop-screen-share', { sessionId, userId: user?.id });
    }
  };

  // Chat functionality
  const handleNewMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;
    
    socket.emit('session-chat-message', {
      sessionId,
      message: messageInput,
      userId: user?.id,
      userName: user?.name || 'Unknown'
    });
    setMessageInput('');
  };

  // Hand raise functionality
  const toggleHandRaise = () => {
    if (!socket) return;
    
    if (!hasRaisedHand) {
      socket.emit('raise-hand', {
        sessionId,
        userId: user?.id,
        userName: user?.name || 'Unknown'
      });
      setHasRaisedHand(true);
    } else {
      socket.emit('lower-hand', { sessionId, userId: user?.id });
      setHasRaisedHand(false);
    }
  };

  const handleHandRaised = ({ userId, userName, socketId }: any) => {
    setParticipants(prev => {
      const newMap = new Map(prev);
      const participant = newMap.get(socketId);
      if (participant) {
        participant.hasRaisedHand = true;
        newMap.set(socketId, participant);
      }
      return newMap;
    });
    
    if (user?.role === 'teacher') {
      toast({
        title: "Hand Raised",
        description: `${userName} has raised their hand`
      });
    }
  };

  const handleHandLowered = ({ socketId }: any) => {
    setParticipants(prev => {
      const newMap = new Map(prev);
      const participant = newMap.get(socketId);
      if (participant) {
        participant.hasRaisedHand = false;
        newMap.set(socketId, participant);
      }
      return newMap;
    });
  };

  const handleScreenShareStarted = ({ userId, socketId }: any) => {
    setParticipants(prev => {
      const newMap = new Map(prev);
      const participant = newMap.get(socketId);
      if (participant) {
        participant.isScreenSharing = true;
        newMap.set(socketId, participant);
      }
      return newMap;
    });
  };

  const handleScreenShareStopped = ({ socketId }: any) => {
    setParticipants(prev => {
      const newMap = new Map(prev);
      const participant = newMap.get(socketId);
      if (participant) {
        participant.isScreenSharing = false;
        newMap.set(socketId, participant);
      }
      return newMap;
    });
  };

  const endCall = () => {
    if (socket) {
      socket.emit('leave-live-session', { sessionId, userId: user?.id });
    }
    navigate(-1);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
  {
    /* Header */
  }<div className="border-b p-4 flex items-center justify-between"><div className="flex items-center gap-4"><h1 className="text-xl font-semibold">Live Classroom</h1><Badge variant="destructive" className="animate-pulse"> LIVE </Badge><span className="text-muted-foreground">
    {participants.size + 1} participants </span>
  </div><div className="flex items-center gap-2"><Button variant="ghost" size="icon"><Settings className="h-5 w-5" />
  </Button><Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  </div><div className="flex-1 flex">
    {
      /* Main video area */
    }<div className="flex-1 flex flex-col">
      {
        /* Video grid */
      }<div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
        {
          /* Local video */
        }<div className="relative bg-muted rounded-lg overflow-hidden aspect-video"><video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" /><div className="absolute bottom-2 left-2 flex items-center gap-2"><Badge variant="secondary">You</Badge>{!isVideoOn && <VideoOff className="h-4 w-4" />} {!isAudioOn && <MicOff className="h-4 w-4" />}
        </div>
        </div>
        {
    /* Remote videos */} {Array.from(participants.entries()).map(([socketId, participant]) => (<div key={socketId} className="relative bg-muted rounded-lg overflow-hidden aspect-video">
          <video ref={(el) => {
            if (el && participant.stream) {
              el.srcObject = participant.stream;
              remoteVideosRef.current.set(socketId,
                el

              )
            }
          }} autoPlay playsInline className="w-full h-full object-cover" /><div className="absolute bottom-2 left-2 flex items-center gap-2"><Badge variant={participant.role === 'teacher' ? 'default' : 'secondary'}>
            {participant.userName}
          </Badge>{participant.hasRaisedHand && <Hand className="h-4 w-4 text-yellow-500" />} {participant.isScreenSharing && <Monitor className="h-4 w-4" />}
          </div>
        </div>))}
      </div>
      {
        /* Controls */
      }
      <div className="border-t p-4 flex items-center justify-center gap-4">
        <Button
          variant={isVideoOn ? "secondary" : "destructive"}
          size="icon"
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button
          variant={isAudioOn ? "secondary" : "destructive"}
          size="icon"
          onClick={toggleAudio}
        >
          {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="icon"
          onClick={toggleScreenShare}
        >
          {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        </Button>
        <Button
          variant={hasRaisedHand ? "default" : "secondary"}
          size="icon"
          onClick={toggleHandRaise}
          disabled={user?.role === 'teacher'}
        >
          <Hand className="h-5 w-5" />
        </Button>
        <Button variant="destructive" size="icon" onClick={endCall}>
          <Phone className="h-5 w-5" />
        </Button>
        <div className="flex gap-2 ml-4">
          <Button
            variant={showChat ? "default" : "ghost"}
            size="icon"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant={showParticipants ? "default" : "ghost"}
            size="icon"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
    {
      /* Side panels */
    }
    {(showChat || showParticipants) && (
      <div className="w-80 border-l flex flex-col">
        {showParticipants && (
          <div className="flex-1 border-b p-4">
            <h3 className="font-semibold mb-4">Participants ({participants.size + 1})</h3>
            <ScrollArea className="h-full">
              <div className="space-y-2">
      {
        /* Current user */
                }
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">You</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role}
                    </p>
        </div>
      </div>
      {
                  /* Other participants */
                }
                {Array.from(participants.values()).map((participant) => (
                  <div key={participant.socketId} className="flex items-center gap-3 p-2 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {participant.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {participant.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.hasRaisedHand && <Hand className="h-4 w-4 text-yellow-500" />}
                      {participant.isScreenSharing && <Monitor className="h-4 w-4" />}
        </div>
                  </div>))}
              </div>
            </ScrollArea>
          </div>
        )}
        {showChat && (
          <div className="flex-1 flex flex-col p-4">
            <h3 className="font-semibold mb-4">Chat</h3>
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {msg.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs font-medium">
                        {msg.userName}
                      </p>
                      <p className="text-sm">
                        {msg.message}
                      </p>
      </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
</div>
  );
};

export default LiveClassroom;
