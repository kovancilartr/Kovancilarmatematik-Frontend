// Use proxy in development, direct API in production
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api" // Use Next.js proxy
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

// New interfaces
export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: Record<string, string> | null;
  seoKeywords: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  subjects?: Subject[]; // Optional, will be included when fetching with `include`
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  order: number;
  categoryId: string;
  category?: Category; // Optional, will be included when fetching with `include`
  lessons?: Lesson[]; // Optional
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  name: string;
  videoUrl: string;
  subjectId: string;
  subject?: Subject; // Optional
  materials?: Material[]; // Optional
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  url: string;
  lessonId: string;
  lesson?: Lesson; // Optional
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private onAuthFailure: (() => Promise<boolean>) | null = null;
  private isRefreshing = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  public setAuthFailureHandler(handler: () => Promise<boolean>) {
    this.onAuthFailure = handler;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
    };

    const headers = new Headers(options.headers);

    if (this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    if (
      options.body &&
      typeof options.body === "string" &&
      !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json");
    } else if (options.body instanceof FormData) {
      if (
        headers.has("Content-Type") &&
        headers.get("Content-Type")?.startsWith("multipart/form-data")
      ) {
        headers.delete("Content-Type");
      }
    }
    config.headers = headers;

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !isRetry) {
        if (!this.onAuthFailure) {
          return {
            success: false,
            error: {
              code: "AUTH_FAILURE_HANDLER_NOT_SET",
              message: "Authentication failure handler not set.",
            },
            timestamp: new Date().toISOString(),
          };
        }
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const refreshed = await this.onAuthFailure();
          this.isRefreshing = false;

          if (refreshed) {
            // Retry the original request with the new token
            return this.request<T>(endpoint, options, true);
          }
        }
      }

      const data = await response.json();

      // Also check for business logic token errors if status is not 401
      if (data.error?.code === "INVALID_TOKEN" && !isRetry) {
        if (!this.onAuthFailure) {
          return {
            success: false,
            error: {
              code: "AUTH_FAILURE_HANDLER_NOT_SET",
              message: "Authentication failure handler not set.",
            },
            timestamp: new Date().toISOString(),
          };
        }
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const refreshed = await this.onAuthFailure();
          this.isRefreshing = false;

          if (refreshed) {
            // Retry the original request with the new token
            return this.request<T>(endpoint, options, true);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: { code: "NETWORK_ERROR", message: "Network error occurred" },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Login request does not need access token
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.success && response.data?.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }
    return response;
  }

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await this.request<RefreshTokenResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    console.log("Auth Refresh Response:" + response);

    // TODO : Burası hata veriyor bunu yapay zekaya soracam sanki burda set etmek gerekmiyor auth-context-provider.tsx içinde ediyoruz gibi geldi bana
    // if (response.success && response.data?.tokens.accessToken) {
    //   this.setAccessToken(response.data.tokens.accessToken);
    // }
    return response;
  }

  async logout(refreshToken: string): Promise<ApiResponse<unknown>> {
    // Logout request needs to clear token after successful logout
    const response = await this.request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    console.log("Auth Logout Response:" + response);
    this.setAccessToken(null); // Clear token on logout
    return response;
  }

  async getProfile(): Promise<ApiResponse<LoginResponse["user"]>> {
    return this.request<LoginResponse["user"]>("/auth/me", {
      method: "GET",
    });
  }

  async logoutAll(accessToken: string): Promise<ApiResponse<unknown>> {
    const response = await this.request("/auth/logout-all", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // This particular endpoint might need a direct token if used outside context
      },
    });
    this.setAccessToken(null); // Clear token on logout all
    return response;
  }

  // Site Settings endpoints
  async getSiteSettings(): Promise<ApiResponse<SiteSettings>> {
    return this.request<SiteSettings>("/site-settings", {
      method: "GET",
    });
  }

  async updateSiteSettings(
    data: Partial<SiteSettings>
  ): Promise<ApiResponse<SiteSettings>> {
    return this.request<SiteSettings>("/site-settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Upload endpoints
  async uploadSingleFile(file: File): Promise<ApiResponse<UploadedFile>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<UploadedFile>("/upload/single", {
      method: "POST",
      body: formData,
    });
  }

  // Category endpoints
  async createCategory(data: {
    name: string;
    order: number;
  }): Promise<ApiResponse<Category>> {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>("/categories", { method: "GET" });
  }
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, { method: "GET" });
  }
  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/categories/${id}`, { method: "DELETE" });
  }

  // Subject endpoints
  async createSubject(data: {
    name: string;
    order: number;
    categoryId: string;
  }): Promise<ApiResponse<Subject>> {
    return this.request<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.request<Subject[]>("/subjects", { method: "GET" });
  }
  async getSubjectsByCategoryId(
    categoryId: string
  ): Promise<ApiResponse<Subject[]>> {
    return this.request<Subject[]>(`/subjects/category/${categoryId}`, {
      method: "GET",
    });
  }
  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    return this.request<Subject>(`/subjects/${id}`, { method: "GET" });
  }
  async updateSubject(
    id: string,
    data: Partial<Subject>
  ): Promise<ApiResponse<Subject>> {
    return this.request<Subject>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  async deleteSubject(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/subjects/${id}`, { method: "DELETE" });
  }

  // Lesson endpoints
  async createLesson(data: {
    name: string;
    videoUrl: string;
    subjectId: string;
  }): Promise<ApiResponse<Lesson>> {
    return this.request<Lesson>("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async getAllLessons(): Promise<ApiResponse<Lesson[]>> {
    return this.request<Lesson[]>("/lessons", { method: "GET" });
  }
  async getLessonsBySubjectId(
    subjectId: string
  ): Promise<ApiResponse<Lesson[]>> {
    return this.request<Lesson[]>(`/lessons/subject/${subjectId}`, {
      method: "GET",
    });
  }
  async getLessonById(id: string): Promise<ApiResponse<Lesson>> {
    return this.request<Lesson>(`/lessons/${id}`, { method: "GET" });
  }
  async updateLesson(
    id: string,
    data: Partial<Lesson>
  ): Promise<ApiResponse<Lesson>> {
    return this.request<Lesson>(`/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  async deleteLesson(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/lessons/${id}`, { method: "DELETE" });
  }

  // Material endpoints
  async createMaterial(data: {
    name: string;
    url: string;
    lessonId: string;
  }): Promise<ApiResponse<Material>> {
    return this.request<Material>("/materials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async getAllMaterials(): Promise<ApiResponse<Material[]>> {
    return this.request<Material[]>("/materials", { method: "GET" });
  }
  async getMaterialsByLessonId(
    lessonId: string
  ): Promise<ApiResponse<Material[]>> {
    return this.request<Material[]>(`/materials/lesson/${lessonId}`, {
      method: "GET",
    });
  }
  async getMaterialById(id: string): Promise<ApiResponse<Material>> {
    return this.request<Material>(`/materials/${id}`, { method: "GET" });
  }
  async updateMaterial(
    id: string,
    data: Partial<Material>
  ): Promise<ApiResponse<Material>> {
    return this.request<Material>(`/materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  async deleteMaterial(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/materials/${id}`, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
