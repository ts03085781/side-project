import Header from './Header';

const layoutStyle = {
    margin: 20,
    padding: 20,
    border: '3px solid  #6495ED',
    borderRadius: '10px',
};

const Layout = (props) => (
  <div style={layoutStyle}>
    <Header/>
    {props.children}
  </div>
);

export default Layout