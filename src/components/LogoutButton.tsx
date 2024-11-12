import { Button } from '@/components/ui/button';
import { useUser } from './UserContext';

export default function LogoutButton() {
  const { setUserId } = useUser();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://193.32.178.205:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUserId(null);
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
