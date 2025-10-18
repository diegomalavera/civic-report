import { Injectable } from '@angular/core';
import { PayloadDto } from '../../core/dtos/payload.dto';
import { jwtDecode } from 'jwt-decode';
import { UserDto } from '../../users/dtos/user.dto';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  isNative = Capacitor.isNativePlatform();

  async saveLogin(tokens: { accessToken: string; refreshToken: string }) {
    this.setItem('accessToken', tokens.accessToken);
    this.setItem('refreshToken', tokens.refreshToken);
    const payload: PayloadDto | null = await this.getAccessToken();
    if (payload) {
      this.saveUser({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        lastName: payload.lastName,
        fullName: `${payload.name} ${payload.lastName}`,
      });
    }
  }

  saveUser(data: { id: string; email: string; name: string; lastName: string; fullName: string }) {
    this.setItem(
      'user',
      JSON.stringify({
        id: data.id,
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        fullName: `${data.name} ${data.lastName}`,
      })
    );
  }

  async getAccessToken() {
    try {
      const token: string = (await this.getItem('accessToken')) || '';
      const accessToken: PayloadDto = jwtDecode<PayloadDto>(token);
      accessToken.token = token;
      const refreshToken: PayloadDto = await this.getRefreshToken();
      accessToken.refreshToken = refreshToken.token;
      return accessToken;
    } catch (e) {
      return null;
    }
  }

  async getRefreshToken() {
    try {
      const token: string = (await this.getItem('refreshToken')) || '';
      const refreshToken: PayloadDto = jwtDecode<PayloadDto>(token);
      refreshToken.token = token;
      return refreshToken;
    } catch (e) {
      throw Error('Error al obtener el refresh token');
    }
  }

  async getUser() {
    try {
      const user: string = (await this.getItem('user')) || '';
      return JSON.parse(user) as UserDto;
    } catch (e) {
      throw Error('Error user');
    }
  }

  async getPermissions() {
    const payload: PayloadDto | null = await this.getAccessToken();
    if (!payload) return [];
    return payload.permissions || [];
  }

  async isAuthenticated() {
    const token: string = (await this.getItem('accessToken')) || '';
    if (token) {
      return true;
    }
    return false;
  }

  async userCan(permission: string) {
    const permissions = await this.getPermissions();
    return permissions.includes(permission);
  }

  async setItem(key: string, value: any) {
    if (this.isNative) {
      await Preferences.set({ key, value: value });
    } else {
      localStorage.setItem(key, value);
    }
  }

  async getItem(key: string) {
    let item: string | null = null;
    if (this.isNative) {
      const result = await Preferences.get({ key });
      item = result.value;
    } else {
      item = localStorage.getItem(key);
    }
    return item;
  }

  async removeItem(key: string) {
    if (this.isNative) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }

  async clear() {
    if (this.isNative) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  }
}
