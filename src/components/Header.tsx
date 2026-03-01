import './Header.css';


export function Header({ firstName, lastName }: { firstName: string, lastName: string }) {
  return (
    <header className="header">
      <h1 className="header-title">{firstName} {lastName}</h1>
    </header>
  );
}
