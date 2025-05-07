import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8089/user';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update`, user);
  }

  updateUserByEmail(email: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update-by-email/${encodeURIComponent(email)}`, user);
  }

  validateOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate-otp`, { email, otp });
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/login`,
      { email, password },
      { responseType: 'text' }
    );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${encodeURIComponent(email)}`);
  }

  loginWithGoogle(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/google-login`, user);
  }
  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/forgot`,
      { email }
    );
  }
}
