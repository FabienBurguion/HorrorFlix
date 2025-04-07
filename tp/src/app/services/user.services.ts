import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly httpClient = inject(HttpClient)
    private readonly url = "http://localhost:8080/users"
    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.url);
    }

    addUser(user: User): Observable<User> {
        return this.httpClient.post<User>(this.url, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.url}/${id}`);
    }

    getUserById(id: number): Observable<User> {
        return this.httpClient.get<User>(`${this.url}/${id}`);
    }

    getUserByEmail(email: string): Observable<User> {
        return this.httpClient.get<User>(`${this.url}/byEmail/${email}`);
    }

    updateUser(user: User): Observable<User> {
        return this.httpClient.put<User>(`${this.url}/${user.id}`, user);
    }
}
