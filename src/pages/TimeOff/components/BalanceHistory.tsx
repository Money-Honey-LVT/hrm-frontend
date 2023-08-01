import { useAppDispatch } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { TimeoffActions } from '@/redux/reducers/timeoff/timeoff.action';
import { IBalance, IBalanceEventDict } from '@/types/models/IBalance';
import {
  IRequest,
  IRequestType,
  IRequestTypeDict
} from '@/types/models/IRequest';
import {
  Card,
  Col,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  useMantineTheme
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconArticle,
  IconCalendar,
  IconChevronDown
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

export interface ComponentRef {
  triggerFunction: () => void;
}

export const BalanceHistory = forwardRef<ComponentRef>(() => {
  const dispatch = useAppDispatch();
  const [_balanceHistory, setBalanceHistory] = useState<IBalance[]>();

  const getBalanceHistory = useCallback(() => {
    dispatch(
      TimeoffActions.getBalanceHistory({
        onSuccess: (data: IBalance[]) => {
          setBalanceHistory(data);
        }
      })
    );
  }, [dispatch]);

  const triggerRef = useRef(() => getBalanceHistory());
  useImperativeHandle(undefined, () => ({
    triggerFunction: triggerRef
  }));

  useEffect(() => {
    console.log('ád');
    getBalanceHistory();
  }, [getBalanceHistory]);

  const [_filteredBalanceHistory, setFilteredBalanceHistory] = useState<
    IBalance[]
  >([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestType, setRequestType] = useState<IRequestType>(
    IRequestType.ALL
  );

  useEffect(() => {
    if (!_balanceHistory) return;
    const filteredData = _balanceHistory.filter((balance: IBalance) => {
      if (
        startDate &&
        endDate &&
        (dayjs(balance.date).toDate() < startDate ||
          dayjs(balance.date).toDate() > endDate)
      ) {
        return false;
      }
      if (requestType !== IRequestType.ALL && balance.type !== requestType) {
        return false;
      }
      return true;
    });
    setFilteredBalanceHistory(filteredData);
  }, [_balanceHistory, startDate, endDate, requestType]);

  const [_remainTimeoffDays, setRemainTimeoffDays] = useState<IRequest[]>();

  const getRemainTimeoffDays = useCallback(() => {
    dispatch(
      TimeoffActions.getMyTimeoff({
        onSuccess: (data: IRequest[]) => {
          setRemainTimeoffDays(data);
        }
      })
    );
  }, [dispatch]);

  useLayoutEffect(() => {
    getRemainTimeoffDays();
  }, [getRemainTimeoffDays]);

  const columns: DataTableColumn<IBalance>[] = [
    {
      accessor: 'date',
      title: 'Ngày'
    },
    {
      accessor: 'event',
      title: 'Sự kiện',
      render: ({ event }) => {
        return <Text>{IBalanceEventDict[event].label}</Text>;
      }
    },
    {
      accessor: 'type',
      title: 'Loại',
      render: ({ type }) => {
        return <Text>{IRequestTypeDict[type].label}</Text>;
      }
    },
    {
      accessor: 'changedBy',
      title: 'Người thay đổi'
    },
    {
      accessor: 'changeDays',
      title: 'Thay đổi (ngày)'
    }
  ];

  const theme = useMantineTheme();
  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _filteredBalanceHistory,
    defaultPaging: {
      page: 1,
      pageSize: 5
    }
  });
  return (
    <>
      <Grid gutter={'xl'} my={'sm'}>
        {_remainTimeoffDays?.map((item) => (
          <Col span={'auto'}>
            <Card withBorder p={'lg'} shadow={'xs'} bg={'gray.1'}>
              <Stack spacing={0}>
                <Text fw={'bold'}>{IRequestTypeDict[item.type].label}</Text>
                <Text color="dimmed" fz={'sm'}>
                  {item.total} ngày{' '}
                </Text>
              </Stack>
            </Card>
          </Col>
        ))}
      </Grid>
      <Card withBorder p={'lg'} shadow={'xs'} bg={'gray.1'}>
        <Group mb={'lg'}>
          <IconArticle
            size={'2rem'}
            style={{
              background: `${theme.colors.blue[7]}`,
              borderRadius: '50%',
              padding: '5px'
            }}
            color="white"
          />
          <Text fw={600} fz={'lg'}>
            Lịch sử số dư
          </Text>
        </Group>

        <Group mb={'lg'}>
          <DateInput
            clearable
            label="Từ"
            value={startDate}
            onChange={setStartDate}
            rightSection={<IconCalendar size="0.9rem" color="blue" />}
          />

          <DateInput
            clearable
            label="Đến"
            value={endDate}
            onChange={setEndDate}
            rightSection={<IconCalendar size="0.9rem" color="blue" />}
          />

          <Select
            label="Loại"
            value={requestType}
            onChange={(value: string | null) =>
              setRequestType(value as IRequestType)
            }
            data={Object.values(IRequestType).map((type) => ({
              value: type,
              label: IRequestTypeDict[type].label
            }))}
            rightSection={<IconChevronDown size="1rem" color="blue" />}
            styles={{ rightSection: { pointerEvents: 'none' } }}
            w={'150px'}
          />
        </Group>

        <DataTable
          minHeight={200}
          striped
          highlightOnHover
          columns={columns}
          records={records}
          totalRecords={_filteredBalanceHistory?.length}
          page={page}
          onPageChange={changePage}
          recordsPerPage={pageSize}
          paginationText={() => null}
        />
      </Card>
    </>
  );
});
