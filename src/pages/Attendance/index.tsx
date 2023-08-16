import { api } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { AttendanceAction } from '@/redux/reducers/attendance/attendance.action';
import { IAttendance } from '@/types/models/IAttendance';
import { removeVietnameseandLowercase } from '@/utils/helpers';
import { Button, Group, Input, Select, Stack, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useLayoutEffect, useState } from 'react';

export const Attendance = () => {
  const dispatch = useAppDispatch();
  const d = new Date();
  const currentMonth = d.getMonth().toString();

  const { attendances } = useAppSelector(
    (state: RootState) => state.attendance
  );

  const [_attendance, setAttendance] = useState<IAttendance[]>(attendances);

  const [_selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [_query, setQuery] = useState('');

  useLayoutEffect(() => {
    dispatch(
      AttendanceAction.getAllAttendances({
        onSuccess: (data: IAttendance[]) => setAttendance(data)
      })
    );
  }, [dispatch]);

  const columns: DataTableColumn<IAttendance>[] = [
    {
      accessor: 'employeeName',
      title: 'Tên nhân viên'
    },

    {
      accessor: 'start',
      title: 'Giờ vào làm',
      render: ({ start }) => (
        <Text>{dayjs(start).format('hh:mm - DD MMM').toString()}</Text>
      )
    },
    {
      accessor: 'end',
      title: 'Giờ tan làm',
      render: ({ end }) => (
        <Text>{dayjs(end).format('hh:mm - DD MMM').toString()}</Text>
      )
    },
    {
      accessor: 'note',
      title: 'Ghi chú'
    }
  ];

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _attendance,
    defaultPaging: {
      page: 1,
      pageSize: 5
    }
  });

  const handleDownloadExcel = async () => {
    const url = API_URLS.Attendance.downloadExcel();
    const fileName = 'Danh_sách_chấm_công.xlsx';

    await api
      .get(url.endPoint, { ...url, responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
  };

  const allMonthDataSelection = [
    {
      value: '12',
      label: 'Tất cả'
    },
    {
      value: '0',
      label: 'Tháng 1'
    },
    {
      value: '1',
      label: 'Tháng 2'
    },
    {
      value: '2',
      label: 'Tháng 3'
    },
    {
      value: '3',
      label: 'Tháng 4'
    },
    {
      value: '4',
      label: 'Tháng 5'
    },
    {
      value: '5',
      label: 'Tháng 6'
    },
    {
      value: '6',
      label: 'Tháng 7'
    },
    {
      value: '7',
      label: 'Tháng 8'
    },
    {
      value: '8',
      label: 'Tháng 9'
    },
    {
      value: '9',
      label: 'Tháng 10'
    },
    {
      value: '10',
      label: 'Tháng 11'
    },
    {
      value: '11',
      label: 'Tháng 12'
    }
  ];

  useEffect(() => {
    const filteredAttendance = attendances.filter((attendance: IAttendance) => {
      // Filter by selected month
      const isInSelectedMonth =
        _selectedMonth === '12' ||
        dayjs(attendance.start).month().toString() === _selectedMonth;

      // Filter by employee name
      const employeeNameLowerCase = removeVietnameseandLowercase(
        attendance.employeeName
      );
      const queryLowerCase = removeVietnameseandLowercase(_query);
      const isIncludeNameString =
        _query === '' || employeeNameLowerCase.includes(queryLowerCase);
      return isInSelectedMonth && isIncludeNameString;
    });

    setAttendance(filteredAttendance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_selectedMonth, _query]);

  return (
    <Stack>
      <Group position="apart">
        <Text fw={600} fz={'lg'}>
          Bảng chấm công
        </Text>
        <Button
          variant="outline"
          leftIcon={<IconDownload size={'1rem'} />}
          onClick={handleDownloadExcel}
        >
          Excel
        </Button>
      </Group>

      <Group>
        <Select
          label="Tháng"
          data={allMonthDataSelection}
          value={_selectedMonth}
          onChange={(value: string) => setSelectedMonth(value)}
        />
        <Stack spacing={0}>
          <Text fz={'sm'} fw={500}>
            Tên nhân viên
          </Text>
          <Input
            w={400}
            value={_query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Nhập tên nhân viên để tìm kiếm"
          />
        </Stack>
      </Group>
      <DataTable
        minHeight={300}
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        columns={columns}
        records={records}
        totalRecords={_attendance?.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
    </Stack>
  );
};
