import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import ErgoIcon from '../Common/ErgoIcon';
import ErgoIconModal from '../Common/ErgoIconModal';
import AlephiumIcon from '@/components/Common/AlephiumIcon';

const items = [
  {
    title: 'Ergo',
    label: 'Select Network',
    customKey: '1',
    key: '1',
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`
    }
  },
  {
    title: 'Ergo',
    label: 'Ergo',
    customKey: '1',
    key: '2',
    icon: <ErgoIconModal />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`
    }
  },

  {
    title: 'Ergo Testnet',
    label: 'Ergo Testnet',
    customKey: '3',
    key: '3',
    icon: <ErgoIconModal />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`
    }
  },
  {
    title: 'Alephium Mainnet',
    label: 'Alephium Mainnet',
    customKey: '4',
    key: '4',
    icon: <AlephiumIcon />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`
    }
  },
  {
    title: 'Alephium Testnet',
    label: 'Alephium Testnet',
    customKey: '5',
    key: '5',
    icon: <AlephiumIcon />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`
    }
  },
  {
    title: 'Alephium Devnet',
    label: 'Alephium Devnet',
    customKey: '6',
    key: '6',
    icon: <AlephiumIcon />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`
    }
  }
];

const DropDown: React.FC = () => {
  const [value, setValue] = useState<string>('Ergo');
  const [icon, setIcon] = useState<any>(null);

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    // @ts-ignore
    const selectedTitle = e.item.props.title;
    // @ts-ignore
    const key = e.item.props.customKey;

    if (key === '6') {
      console.log('disabled');
      return;
    }

    localStorage.setItem('network', key);

    setValue(selectedTitle);
    localStorage.removeItem('walletConfig');
    window.location.reload();
  };

  useEffect(() => {
    const network = localStorage.getItem('network');

    switch (network) {
      case '2':
        setValue('Ergo');
        setIcon(<ErgoIcon />);
        break;
      case '3':
        setValue('Ergo Testnet');
        setIcon(<ErgoIcon />);
        break;
      case '4':
        setValue("Alephium Mainnet");
        setIcon(<AlephiumIcon />);
        break;
      case '5':
        setValue('Alephium Testnet');
        setIcon(<AlephiumIcon />);
        break;
      case '6':
        // setValue("Alephium Devnet");
        // setIcon(<AlephiumIcon />);
        break;
      default:
        setValue('Ergo');
        setIcon(<ErgoIcon />);
        break;
    }
  }, []);

  const menuProps = {
    items,
    onClick: handleMenuClick
  };
  return (
    <Space wrap>
      <Dropdown menu={menuProps}>
        <Button
          type="primary"
          ghost
          size="large"
          className="!px-2.5 sm:!px-4"
          style={{
            color: 'white',
            border: 'none',
            backgroundImage:
              'linear-gradient( to right, rgba(208, 0, 0, 1), rgba(255, 122, 0, 1) )',
            fontFamily: `'Space Grotesk', sans-serif`
          }}
        >
          <Space
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: `'Space Grotesk', sans-serif`
            }}
          >
            {icon}
            {value}
            <div style={{ marginTop: '-5px' }}>
              <DownOutlined color="white" />
            </div>
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default DropDown;
