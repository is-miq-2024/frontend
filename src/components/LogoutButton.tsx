import { Button } from '@/components/ui/button';
import { useUser } from './UserContext';

export default function LogoutButton() {
  const { userLogin, userPassword, setUserLogin, setUserPassword } = useUser();

  const handleLogout = async () => {
    if (!userLogin || !userPassword) return;

    localStorage.removeItem('userLogin');
    localStorage.removeItem('userPassword');

    setUserLogin(null);
    setUserPassword(null);
    console.log("Logout successfull");
  };
  return (
    <Button onClick={handleLogout} className="w-full">
      Выйти
    </Button>
  );
}

