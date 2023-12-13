import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box, Button, Container } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import RemainingLife from "../../../components/RemainingLife";
import { format } from "date-fns";
import BackLink from "../../../components/BackLink";
import PageHead from "../../../components/PageHead";
import { useRecoilValue } from "recoil";
import userAtom from "../../../recoil/atom/userAtoms";
import ProtectRoute from "../../../components/ProtectRoute";

type personData = {
  id: number;
  name: string;
  sex: string;
  birthDate: string;
  remainingLife: number;
  isAccountUser: boolean;
  remainTime: number;
};

const Persons = () => {
  const [persons, setPersons] = useState<personData[]>();
  const user = useRecoilValue(userAtom);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    const setPersonData = async () => {
      if (user) {
        // ユーザに紐づく登録人物の情報を取得
        const personsData = await apiClient.get("/persons/findAll", {
          data: { userId: user.id },
        });

        setPersons(personsData.data.formattedPersons);
      }
    };
    setPersonData();
  }, [user, setPersons]);

  // birthDate を "yyyy年MM月dd日" の形式にフォーマット
  const formatBirthDate = (params: GridRenderCellParams<any>) => {
    const formattedDate = format(
      new Date(params.row.birthDate),
      "yyyy年MM月dd日",
    );
    return formattedDate;
  };

  const handleSortModelChange = (model: GridSortModel) => {
    if (model[0]?.field === "remainingLife" && persons) {
      // remainingLife列に基づいてソートする
      const sortedPersons = [...persons].sort((a, b) => {
        if (model[0].sort === "asc") {
          return a.remainTime - b.remainTime;
        } else {
          return b.remainTime - a.remainTime;
        }
      });
      setPersons(sortedPersons);
    }
    setSortModel(model);
  };

  // 表のカラム設定
  const cols: GridColDef[] = [
    {
      field: "name",
      headerName: "名前",
      minWidth: 150,
    },
    {
      field: "birthDate",
      headerName: "生年月日",
      minWidth: 140,
      renderCell: formatBirthDate,
    },
    {
      field: "sex",
      headerName: "性別",
      width: 80,
      renderCell: (params: GridRenderCellParams<any>) => {
        // 表示するsexをmale/femaleから男/女に変換
        const formattedSex = params.row.sex === "male" ? "男" : "女";
        return formattedSex;
      },
    },
    {
      field: "remainingLife",
      headerName: "余命",
      minWidth: 220,
      width: 200,
      flex: 0.3,
      renderCell: (params: GridRenderCellParams<any>) => (
        // <RemainingLife person={person:{sex: ...params.row.sex,birthDate: ...params.row.birthDate} } />
        <RemainingLife
          person={{ sex: params.row.sex, birthDate: params.row.birthDate }}
        />
      ),
    },
    {
      field: "show",
      headerName: "",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 30,
      flex: 0.3,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <Link className="text-blue-400" href={`/persons/${params.id}`}>
            編集
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <ProtectRoute user={user}>
        <PageHead>
          <title>余命一覧</title>
        </PageHead>
        {persons && (
          <Container maxWidth="md">
            <Box>
              <Button
                href="/persons/create"
                variant="contained"
                sx={{
                  margin: "1rem 0",
                  backgroundColor: "#1565C0",
                  color: "#FFFFFF",
                }}
              >
                新規登録
              </Button>
              <DataGrid
                columns={cols}
                rows={persons}
                density="compact"
                autoHeight
                disableColumnMenu
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                sx={{
                  "& .user-row": {
                    background: "#aee7ff !important",
                  },
                }}
                // ユーザ情報の場合、背景色で強調表示
                getRowClassName={(params: GridRowParams) => {
                  if (params.row.isAccountUser) {
                    return "user-row";
                  }
                  return "";
                }}
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
              />
            </Box>
            <BackLink />
          </Container>
        )}
      </ProtectRoute>
    </>
  );
};

export default Persons;
