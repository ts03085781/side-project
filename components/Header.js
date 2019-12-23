import Link from 'next/link';

const linkStyle = {
  marginRight: 15,
  fontFamily: 'Baloo Bhai',
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>
    <Link href="/game">
      <a style={linkStyle}>game</a>
    </Link>
  </div>
);

export default Header