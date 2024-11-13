import { Button } from '@/components/ui/button';
import { useUser } from './UserContext';

export default function LogoutButton() {
  const { userLogin, userPassword, setUserLogin, setUserPassword } = useUser();

  const handleLogout = async () => {
    if (!userLogin || !userPassword) return;

    const credentials = btoa(`${userLogin}:${userPassword}`);
    try {
      const response = await fetch('http://193.32.178.205:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setUserLogin(null);
        setUserPassword(null);
        console.log('User logged out successfully');
      } else {
        console.error('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Button onClick={handleLogout} className="w-full">
      Выйти
    </Button>
  );
}

