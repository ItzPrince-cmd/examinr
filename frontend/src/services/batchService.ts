import api from './api';

export interface Batch {
  _id: string;
  name: string;
  code: string;
  description?: string;
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subject: string;
  level: string;
  schedule: {
    startDate: string;
    endDate: string;
    classDays: string[];
    classTime: {
      hour: number;
      minute: number;
    };
    duration: number;
    timezone: string;
  };
  enrollment: {
    maxStudents: number;
    enrolledStudents: Array<{
      student: any;
      enrolledAt: string;
      status: string;
    }>;
    requiresApproval: boolean;
    enrollmentDeadline?: string;
    price: {
      amount: number;
      currency: string;
    };
  };
  liveSessions: Array<{
    _id: string;
    title: string;
    description?: string;
    scheduledDate: string;
    duration: number;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    meetingId?: string;
    meetingPassword?: string;
    startedAt?: string;
    endedAt?: string;
    attendance: Array<{
      student: string;
      joinedAt: string;
      leftAt?: string;
      duration?: number;
    }>;
  }>;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  settings: {
    allowRecording: boolean;
    allowChat: boolean;
    allowScreenShare: boolean;
    allowStudentMic: boolean;
    allowStudentVideo: boolean;
    autoRecord: boolean;
  };
  currentEnrollment?: number;
  availableSlots?: number;
  isFull?: boolean;
  isOngoing?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchData {
  name: string;
  description?: string;
  subject: string;
  level: string;
  schedule: {
    startDate: string;
    endDate: string;
    classDays: string[];
    classTime: {
      hour: number;
      minute: number;
    };
    duration: number;
    timezone: string;
  };
  enrollment: {
    maxStudents: number;
    requiresApproval: boolean;
    enrollmentDeadline?: string;
    price?: {
      amount: number;
      currency: string;
    };
  };
  settings?: {
    allowRecording?: boolean;
    allowChat?: boolean;
    allowScreenShare?: boolean;
    allowStudentMic?: boolean;
    allowStudentVideo?: boolean;
    autoRecord?: boolean;
  };
}

export interface LiveSession {
  title: string;
  description?: string;
  scheduledDate: string;
  duration: number;
}

class BatchService {
  // Get all batches
  async getBatches(params?: {
    subject?: string;
    level?: string;
    status?: string;
    teacher?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/batches', { params });
    return response.data;
  }

  // Get batch by ID
  async getBatchById(batchId: string) {
    const response = await api.get(`/batches/${batchId}`);
    return response.data;
  }

  // Create new batch (Teacher only)
  async createBatch(data: CreateBatchData) {
    const response = await api.post('/batches', data);
    return response.data;
  }

  // Update batch (Teacher only)
  async updateBatch(batchId: string, data: Partial<CreateBatchData>) {
    const response = await api.put(`/batches/${batchId}`, data);
    return response.data;
  }

  // Delete batch (Teacher only)
  async deleteBatch(batchId: string) {
    const response = await api.delete(`/batches/${batchId}`);
    return response.data;
  }

  // Get teacher's batches
  async getTeacherBatches(status?: string) {
    const response = await api.get('/batches/teacher/my-batches', { params: { status } });
    return response.data;
  }

  // Get student's enrolled batches
  async getStudentBatches() {
    const response = await api.get('/batches/student/my-batches');
    return response.data;
  }

  // Enroll in a batch (Student only)
  async enrollInBatch(batchId: string) {
    const response = await api.post(`/batches/${batchId}/enroll`);
    return response.data;
  }

  // Unenroll from a batch (Student only)
  async unenrollFromBatch(batchId: string) {
    const response = await api.post(`/batches/${batchId}/unenroll`);
    return response.data;
  }

  // Get batch students (Teacher only)
  async getBatchStudents(batchId: string) {
    const response = await api.get(`/batches/${batchId}/students`);
    return response.data;
  }

  // Add live session to batch (Teacher only)
  async addLiveSession(batchId: string, session: LiveSession) {
    const response = await api.post(`/batches/${batchId}/sessions`, session);
    return response.data;
  }

  // Start live session (Teacher only)
  async startLiveSession(batchId: string, sessionId: string) {
    const response = await api.post(`/batches/${batchId}/sessions/${sessionId}/start`);
    return response.data;
  }

  // End live session (Teacher only)
  async endLiveSession(batchId: string, sessionId: string) {
    const response = await api.post(`/batches/${batchId}/sessions/${sessionId}/end`);
    return response.data;
  }

  // Search batches by code
  async searchByCode(code: string) {
    const response = await api.get('/batches', { params: { search: code, limit: 1 } });
    return response.data;
  }
}

export default new BatchService();