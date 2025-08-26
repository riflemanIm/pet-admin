import React from 'react';

import Chat from '../../components/Chat';
import { getMedicalNetSettingsInfo, useUserState } from '../../context/UserContext';
import { Box } from '@mui/material';
import { useLanguageValue } from '../../context/LanguageContext';
import { Contact } from '@pmt/chat';
import { actions } from '../../context/ManagementContext';
import { useLocation, useNavigate } from 'react-router-dom';

const OperatorChat = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const {
    currentUser: { medicalNetId }
  } = useUserState();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatServerAddress, setChatServerAddress] = React.useState('');

  React.useEffect(() => {
    getMedicalNetSettingsInfo(medicalNetId).then((info) => {
      setChatServerAddress(info.chatServerAddress);
    });
  }, []);

  if (chatServerAddress) {
    /**
     * 290px - это высота элементов до и после чата (подвал, заголовок, крошки)
     */
    return (
      <Box sx={{ height: 'calc(100vh - 290px)' }}>
        <Chat
          lang={languageState.language}
          chatServerAddress={chatServerAddress}
          fullWidth={true}
          activeGroupId={location.state?.activeGroupId}
          onContactInfoClick={(contact: Contact) => {
            actions.getChatUserInfo(contact.userId).then((data) => {
              // подготавливаем фильтр
              localStorage.setItem(
                'user:filter2',
                JSON.stringify({
                  items: [
                    {
                      field: 'userId',
                      operator: '=',
                      value: data.userId
                    }
                  ]
                })
              );
              // переходим в список
              navigate('/user/list');
            });
          }}
        />
      </Box>
    );
  }
  return <></>;
};

export default OperatorChat;
