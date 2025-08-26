import React from 'react';
import DateFnsAdapter from '@date-io/date-fns';
import { useSnackbar } from 'notistack';
import { Box, Button, Stack } from '@mui/material';
import { GridActionsCellItem, GridRowParams, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Widget from '../../components/Widget';
import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';

// Icons
import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  ChatOutlined as ChatIcon,
  CheckOutlined as CheckIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  Merge as MergeIcon,
  TokenOutlined as TokenIcon,
  SmartToyOutlined as SmartToyIcon
} from '@mui/icons-material';

import { AccountRole, getEnumName, listEnums, RegistrationSource, isNetRole } from '../../helpers/enums';
import { UserDto } from '../../helpers/dto';
import { useUserState } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import TokenDialog from './TokenDialog';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import UserDetailsDialog from './UserDetailsDialog';
import { QuestionDialog } from '../../components/Common/questionDialog';
import UserMergeDialog from './UserMergeDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const UserList = (): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    currentUser: { role }
  } = useUserState();

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text?: string | null) {
    if (!text) return;
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

  const [issueToken, setIssueToken] = React.useState<{
    isOpen: boolean;
    userId?: number;
    medicalNetId?: number;
  }>({
    isOpen: false
  });

  const [details, setDetails] = React.useState<{
    isOpen: boolean;
    userId: number;
  }>({
    isOpen: false,
    userId: 0
  });

  const [merge, setMerge] = React.useState<{
    isOpen: boolean;
    userIds: number[];
  }>({
    isOpen: false,
    userIds: []
  });

  const [question, setQuestion] = React.useState<{
    isOpen: boolean;
    title: string;
    text: string;
    apply?: () => void;
  }>({
    isOpen: false,
    title: '',
    text: ''
  });

  const dispatch = useManagementDispatch();
  const managementValue = useManagementState();

  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const closeQuestionDialog = () => {
    setQuestion({
      ...question,
      isOpen: false
    });
  };

  const applyQuestionDialog = () => {
    const { apply } = question;
    closeQuestionDialog();
    if (apply) apply();
  };

  const handleDelete = () => {
    actions
      .doDelete(managementValue.idToDelete as number)(dispatch)
      .then(() => {
        sendNotification(t('COMMON.RECORDDELETED'));
      });
  };

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  const closeTokenDialog = () => {
    setIssueToken({
      isOpen: false
    });
  };

  const closeDetailsDialog = () => {
    setDetails({
      isOpen: false,
      userId: 0
    });
  };

  const closeMergeDialog = (success: boolean) => {
    setMerge({
      isOpen: false,
      userIds: []
    });
    if (success) {
      dispatch({ type: 'LIST_REFRESH' });
    }
  };

  const doUserActivate = (userId: number) => {
    actions.doActivate(userId, sendNotification)(dispatch);
  };

  const getActions = React.useCallback(
    (params: GridRowParams<UserDto>) => {
      if (role === AccountRole.admin) {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<CreateIcon />}
            label="Edit"
            color="primary"
            onClick={() => navigate(`/user/${params.id}/edit`)}
          />,
          <GridActionsCellItem
            key="token"
            icon={<TokenIcon />}
            label="Issue support token"
            color="primary"
            onClick={() =>
              setIssueToken({
                isOpen: true,
                userId: params.id as number,
                medicalNetId: params.row.medicalNetId
              })
            }
          />,
          <GridActionsCellItem
            key="details"
            icon={<SmartToyIcon />}
            label="details"
            color="primary"
            onClick={() =>
              setDetails({
                isOpen: true,
                userId: params.id as number
              })
            }
          />,
          <GridActionsCellItem
            key="activate"
            icon={<CheckIcon />}
            label="Activate"
            color="primary"
            disabled={params.row.isActive}
            onClick={() => {
              setQuestion({
                isOpen: true,
                title: t('USER.ACTIVATE_TITLE'),
                text: t('USER.ACTIVATE_TEXT'),
                apply: () => doUserActivate(params.id as number)
              });
            }}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            color="primary"
            onClick={() => openModal(params.id as number)}
          />
        ];
      }
      if (role === AccountRole.netAdmin) {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<CreateIcon />}
            label="Edit"
            color="primary"
            onClick={() => navigate(`/user/${params.id}/editNet`)}
          />,
          <GridActionsCellItem
            key="details"
            icon={<SmartToyIcon />}
            label="details"
            color="primary"
            onClick={() =>
              setDetails({
                isOpen: true,
                userId: params.id as number
              })
            }
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            color="primary"
            disabled={!!params.row.mmk}
            onClick={() => openModal(params.id as number)}
          />
        ];
      }
      if (role === AccountRole.operator) {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<CreateIcon />}
            label="Edit"
            color="primary"
            onClick={() => navigate(`/user/${params.id}/editNet`)}
          />,
          <GridActionsCellItem
            key="details"
            icon={<SmartToyIcon />}
            label="details"
            color="primary"
            onClick={() =>
              setDetails({
                isOpen: true,
                userId: params.id as number
              })
            }
          />,
          <GridActionsCellItem
            key="chat"
            icon={<ChatIcon />}
            label="chat"
            color="primary"
            onClick={() => {
              // получаем id группы с оператором
              actions.getChatIdentifiers(params.id as number).then((chat) => {
                if (chat.warning) {
                  enqueueSnackbar(chat.warning, {
                    variant: 'warning'
                  });
                }
                // переходим в чат
                navigate('/chat', {
                  state: {
                    activeGroupId: chat.operatorGroupId
                  }
                });
              });
            }}
          />
        ];
      }
      return [];
    },
    [role]
  );

  const dateFns = new DateFnsAdapter();
  const columns: GridColDef<UserDto>[] = [
    {
      field: 'userId',
      align: 'left',
      headerName: t('USER.FIELDS.userId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('USER.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      width: role === AccountRole.admin ? 200 : 120,
      type: 'actions',
      getActions: (params: GridRowParams) => getActions(params)
    },
    {
      field: 'isActive',
      headerName: t('USER.FIELDS.isActive') ?? '',
      type: 'boolean'
    },
    {
      field: 'userType',
      align: 'left',
      headerName: t('USER.FIELDS.userType') ?? '',
      type: 'singleSelect',
      valueOptions: listEnums(AccountRole, t, 'ENUMS.AccountRole'),

      valueFormatter: (value: string) => getEnumName(AccountRole, value, t, 'ENUMS.AccountRole')
    },
    {
      field: 'email',
      align: 'left',
      headerName: t('USER.FIELDS.email') ?? '',
      width: 200
    },
    {
      field: 'phone',
      align: 'left',
      headerName: t('USER.FIELDS.phone') ?? '',
      width: 120
    },
    {
      field: 'mmk',
      align: 'left',
      headerName: t('USER.FIELDS.mmk') ?? '',
      type: 'number'
    },
    {
      field: 'fullName',
      align: 'left',
      headerName: t('USER.FIELDS.fullName') ?? '',
      minWidth: 200,
      flex: 1
    },
    {
      field: 'gender',
      align: 'left',
      headerName: t('USER.FIELDS.gender') ?? '',
      type: 'singleSelect',
      valueOptions: ['F', 'M'],
      width: 60
    },
    {
      field: 'birthDate',
      align: 'right',
      headerName: t('USER.FIELDS.birthDate') ?? '',
      width: 120,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
    },
    {
      field: 'cdate',
      align: 'right',
      headerName: t('USER.FIELDS.cdate') ?? '',
      width: 150,
      type: 'dateTime',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy HH:mm') : '')
    },
    {
      field: 'registrationSourceId',
      align: 'center',
      headerName: t('USER.FIELDS.registrationSourceId') ?? '',
      width: 100,
      type: 'singleSelect',
      valueOptions: listEnums(RegistrationSource, t, 'ENUMS.RegistrationSource'),
      valueFormatter: (value: string) => getEnumName(RegistrationSource, value, t, 'ENUMS.RegistrationSource')
    },
    {
      field: 'lastActive',
      align: 'right',
      headerName: t('USER.FIELDS.lastActive') ?? '',
      width: 150,
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy HH:mm') : '')
    },
    {
      field: 'hasDuplicate',
      headerName: t('USER.FIELDS.hasDuplicate') ?? '',
      width: 60,
      type: 'boolean'
    }
  ];

  const canMerge = role === AccountRole.admin || role === AccountRole.netAdmin || role === AccountRole.operator;

  return (
    <Stack spacing={3}>
      <TokenDialog
        isOpen={issueToken.isOpen}
        userId={issueToken.userId}
        defaultMedicalNetId={issueToken.medicalNetId}
        medicalNets={managementValue.medicalNets.filter((it) => !!it.appCode)}
        onClose={closeTokenDialog}
        onRequestToken={actions.doIssueSupportToken}
      />
      <UserDetailsDialog
        isOpen={details.isOpen}
        userId={details.userId}
        onClose={closeDetailsDialog}
        onRequestEmrRecords={actions.getEmrRecords}
        onDeleteEmrRecord={actions.deleteEmrRecord}
        onRequestVisitRecords={actions.getVisitRecords}
        onSetVisitOutsidePlanning={actions.setVisitOutsidePlanning}
        onRequestSpam={actions.getSpam}
        onDeleteSpam={actions.deleteSpam}
        onRequestConfirmationCodes={actions.getConfirmationCodes}
        onRequestNotificationSettings={actions.getNotificationSettings}
        onRequestNotificationList={actions.getNotificationList}
      />
      <UserMergeDialog
        isOpen={merge.isOpen}
        onClose={closeMergeDialog}
        userIds={merge.userIds}
        onRequestMergeInfo={actions.getMergeInfo}
        onMerge={actions.doMerge}
      />
      <DeleteDialog open={managementValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <QuestionDialog
        open={question.isOpen}
        title={question.title}
        text={question.text}
        onClose={closeQuestionDialog}
        onOk={applyQuestionDialog}
      />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<UserDto>
          columns={columns}
          idField="userId"
          exportName="users"
          storagePrefix="user"
          state={managementValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'userId',
              sort: 'desc'
            }
          ]}
          checkboxSelection={canMerge}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          startActions={
            <React.Fragment>
              {!isNetRole(role) && (
                <Button size="small" color="primary" href="#user/add" startIcon={<AddIcon />}>
                  {t('LIST.ADD')}
                </Button>
              )}
              {canMerge && (
                <Button
                  size="small"
                  color="primary"
                  disabled={selectionModel.length !== 2}
                  onClick={() => {
                    console.log(selectionModel);
                    setMerge({
                      isOpen: true,
                      userIds: selectionModel as number[]
                    });
                  }}
                  startIcon={<MergeIcon />}
                >
                  {t('USER.MERGE')}
                </Button>
              )}
            </React.Fragment>
          }
          endActions={
            role !== AccountRole.operator ? (
              <Button size="small" color="primary" href="#user/report" startIcon={<BarChartIcon />}>
                {t('USER.REPORT')}
              </Button>
            ) : undefined
          }
        />
      </Widget>
    </Stack>
  );
};

export default UserList;
