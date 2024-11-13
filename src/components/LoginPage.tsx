import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useUser } from './UserContext';

export default function LoginPage() {
  const { setUserLogin, setUserPassword } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://193.32.178.205:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, password }),
      });
      console.log("Sent to /login endpoint:", JSON.stringify({ login: username, password }))

      if (response.ok) {
        const data = await response.json();
        if (data.userId) {
          setUserLogin(username);
          setUserPassword(password);
          console.log('User logged in with ID:', data.userId);
        } else {
          console.error('Error: No userLogin returned from the server', data);
        }
      } else {
        console.error('Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setUsername('');
    setPassword('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Войти</CardTitle>
        <CardDescription>Введите логин и пароль</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Юзернейм</label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Введите юзернейм"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Пароль</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
