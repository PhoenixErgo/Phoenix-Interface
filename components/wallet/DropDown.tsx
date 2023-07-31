import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import ErgoIcon from '../Common/ErgoIcon';

const items: MenuProps['items'] = [
  {
    title: 'Ergo',
    label: 'Select Network',
    key: '1',
    style: {
      width: 150,
      color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`,
    },
  },
  {
    title: 'Ergo',
    label: 'Ergo',
    key: '2',
    icon: <ErgoIcon />,
    style: {
      width: 150,
      color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`,
    },
  },

  {
    title: 'Ergo Testnet',
    label: 'Ergo Testnet',
    key: '3',
    icon: <ErgoIcon />,
    style: {
      width: 150,
      color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`,
    },
  },
];

const DropDown: React.FC = () => {
  const [value, setValue] = useState<string>('Ergo');
  const [icon, setIcon] = useState<any>();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // @ts-ignore
    const selectedTitle = e.item?.props?.title;

    if (!selectedTitle || selectedTitle === 'Ergo') {
      localStorage.setItem('IsMainnet', 'true');
    } else {
      localStorage.setItem('IsMainnet', 'false');
    }

    setValue(selectedTitle);
  };

  useEffect(() => {
    const isMainnet = localStorage.getItem('IsMainnet');

    if (!isMainnet || isMainnet === 'true') {
      setValue('Ergo');
    } else {
      setValue('Ergo Testnet');
    }
  }, []);

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Space wrap>
      <Dropdown menu={menuProps}>
        <Button
          type="primary"
          ghost
          size="large"
          style={{
            color: 'white',
            border: '1px solid #434343',
            paddingRight: 15,
            background: '#141414',
            fontFamily: `'Space Grotesk', sans-serif`,
          }}
        >
          <Space
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: `'Space Grotesk', sans-serif`,
            }}
          >
            <ErgoIcon />
            {value}
            <div style={{ marginTop: '-5px' }}>
              <DownOutlined />
            </div>
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default DropDown;
