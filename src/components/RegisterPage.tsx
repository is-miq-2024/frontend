import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useUser } from './UserContext';

const formSchema = z.object({
  username: z.string().min(5, 'Юзернейм должен содержать >5 символов'),
  password: z.string().min(8, 'Пароль должен содежрать >8 символов')
    .regex(/[A-Z]/, 'Минимум одна буква верхнего регистра')
    .regex(/[a-z]/, 'Минимум одна буква нижнего регистра')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Один специальный символ *(),.?":{}|<>)')
});

export default function RegisterPage() {
  const { setUserId } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const result = formSchema.safeParse({ username, password });
    if (result.success) {
      setErrors({ username: '', password: '' });
      setIsValid(true);
    } else {
      const formattedErrors = result.error.format();
      setErrors({
        username: formattedErrors.username?._errors[0] || '',
        password: formattedErrors.password?._errors[0] || ''
      });
      setIsValid(false);
    }
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const response = await fetch('http://193.32.178.205:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.userId) {
          setUserId(data.userId); // Save userId to context
          console.log('User registered with ID:', data.userId);
        } else {
          console.error('Error: No userId returned from the server');
        }
      } else {
        console.error('Failed to register. Please try again.');
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
        <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
        <CardDescription>Придумайте логин и пароль</CardDescription>
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
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Пароль</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <ul className="text-xs text-gray-500 list-disc list-inside">
              <li>Минимум 8 символов</li>
              <li>Минимум одна буква нижнего регистра</li>
              <li>Минимум одна буква верхнего регистра</li>
              <li>Один специальный символ *(),.?":{}|&lt;&gt;)</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Зарегистрироваться
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
