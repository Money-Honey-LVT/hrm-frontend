import CustomLoader from '@/components/custom/CustomLoader';
import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { UnitActions } from '@/redux/reducers/unit/unit.action';
import { IUnit } from '@/types/models/IUnit';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import {
  Button,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useLayoutEffect, useState } from 'react';
import ModalUpdateUnit from './components/ModalUpdateUnit';
import ModalCreateUnit from './components/ModalCreateUnit';
import { getWardsDataWithDistrictName } from '@/json/helper';

const Unit: React.FC = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const dispatch = useAppDispatch();
  const units = getWardsDataWithDistrictName();
  const [_records, setRecords] = useState(units);
  const [_selectedRecord, setSelectedRecord] = useState<IUnit | null>(
    null
  );
  const [_query, setQuery] = useState('');
  const [debounceQuery] = useDebouncedValue(_query, 200);

  useEffect(() => {
    setRecords(
      units.filter((unit) => {
        if (debounceQuery !== '') {
          if (
            unit.name
              .toLocaleLowerCase()
              .includes(debounceQuery.toLocaleLowerCase()) ||
              unit?.parent_name
              .toLocaleLowerCase()
              .includes(debounceQuery.toLocaleLowerCase())
          ) {
            return true;
          }
        } else {
          return true;
        }
      })
    );
  }, [units, debounceQuery]);


  const [openedAddModal, { close: closeAddModal, open: openAddModal }] =
    useDisclosure();
  const [
    openedUpdateModal,
    { open: openUpdateModal, close: closeUpdateModal }
  ] = useDisclosure();

  const hanldeUpdate = (department: IUnit) => {
    setSelectedRecord(department);
    openUpdateModal();
  };

  const handleDelete = (department: IUnit) => {
    modals.openConfirmModal({
      title: 'Xác nhận xoá',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      onConfirm: () => {
        dispatch(
          UnitActions.deleteUnit(department.id, {
            onSuccess: () => dispatch(UnitActions.getAllUnit())
          })
        );
      }
    });
  };

  const columns: DataTableColumn<IUnit>[] = [
    {
      accessor: 'name',
      title: 'Tên huyện'
    },
    {
      accessor: 'parent_name',
      title: 'Tên xã'
    },
    // {
    //   accessor: '',
    //   title: '',
    //   render: (department: IUnit) => {
    //     return (
    //       <Group position="center">
    //         <IconEdit
    //           cursor={'pointer'}
    //           size={'1rem'}
    //           onClick={() => {}}
    //         />
    //         {isGrantedPermission(
    //           _authorities,
    //           RESOURCES.UNIT,
    //           SCOPES.DELETE
    //         ) ? (
    //           <Tooltip label="Xoá đơn vị">
    //             <IconTrash
    //               cursor={'pointer'}
    //               size={'1rem'}
    //               onClick={() => handleDelete(department)}
    //             />
    //           </Tooltip>
    //         ) : null}
    //       </Group>
    //     );
    //   }
    // }
  ];

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _records,
    defaultPaging: {
      page: 1,
      pageSize: 10
    }
  });

  // if (!_authorities) {
  //   return <CustomLoader />;
  // }

  // if (!isGrantedPermission(_authorities, RESOURCES.UNIT, SCOPES.VIEW)) {
  //   return <Navigate to={ROUTER.UNAUTHORIZE} />;
  // }

  return (
    <Stack>
      <Text fw={600} size={'lg'}>
        Danh sách đơn vị
      </Text>
      <Group position={'apart'}>
        <Input
          placeholder="Tìm kiếm đơn vị theo tên"
          miw={300}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      </Group>
      <DataTable
        minHeight={200}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={_records?.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />

      <Modal
        centered
        opened={openedAddModal}
        onClose={closeAddModal}
        title="Thêm đơn vị"
      >
        <ModalCreateUnit closeModal={closeAddModal} />
      </Modal>

      <Modal
        centered
        opened={openedUpdateModal}
        onClose={closeUpdateModal}
        title="Cập nhật thông tin đơn vị"
      >
        <ModalUpdateUnit
          closeModal={closeUpdateModal}
          department={_selectedRecord}
        />
      </Modal>
    </Stack>
  );
};

export default Unit;
