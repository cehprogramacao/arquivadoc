
import { Search } from "../Search/Search";
import { Buttons } from "../Button/Button";
import DocList from "../List/DocList";


export const Main = () => {

  return (
    <div className="" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 60px',
      gap: '40px',
      position: 'absolute',
      width: '100%',
      left: '0',
      top: '80px',
      minHeight: '539px',
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        flexWrap: "wrap",
        justifyContent: 'center'
      }}>
        <Search   />
        <Buttons title='Cadastrar' color={'#3699FF'}/>
        <Buttons title='Lixeira' color="#F64E60"/>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column ',
        padding: '0px',
        gap: '0px',
        width: 'auto',
        height: '50px',
        left: '29px',
        top: '0px'
      }}>
        <h3 style={{
          color: '#212121',
          fontWeight: '500'
        }}>Recentes</h3>
        <span style={{
          color: '#B5B5C3'
        }}>More than 400+ new members</span>
      </div>
      <DocList />
    </div>
  );
};

