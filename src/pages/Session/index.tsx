import { useCallApi } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import usePagination from '@/hooks/use-pagination';
import { ISession } from '@/types/models/ISession';
import { Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';

export const Session = () => {
  const [allSession, setAllSession] = useState<ISession[]>([]);

  const getSession = async () => {
    const api = API_URLS.Session.getAll();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { response, error } = await useCallApi({ ...api });
    if (!error && response) {
      console.log(response.data.data);
      setAllSession(response.data.data);
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  const columns: DataTableColumn<ISession>[] = [
    {
      accessor: 'usernames',
      title: 'Tên tài khoản'
    },
    {
      title: 'Lần cuối đăng nhập',
      accessor: 'lastActivityTime',
      render: ({ lastActivityTime }) => {
        return (
          <Text>
            {dayjs(lastActivityTime).format('HH:mm:ss ngày DD MMM YYYY ')}
          </Text>
        );
      }
    }
  ];
  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: allSession,
    defaultPaging: {
      page: 1,
      pageSize: 10
    }
  });

  return (
    <Stack>
      <Text fw={600} size={'lg'}>
        Lịch sử đăng nhập
      </Text>
      <DataTable
        minHeight={200}
        withBorder
        striped
        withColumnBorders
        highlightOnHover
        columns={columns}
        records={[]}
        totalRecords={allSession.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
    </Stack>
  );
};
