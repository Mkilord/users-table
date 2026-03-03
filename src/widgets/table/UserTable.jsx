import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../entities/user/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Stack,
  TablePagination,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export function UsersTable() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const [sortField, setSortField] = useState("lastName");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { label: "Фамилия", field: "lastName", apiField: "lastName" },
    { label: "Имя", field: "firstName", apiField: "firstName" },
    { label: "Отчество", field: "maidenName", apiField: "maidenName" },
    { label: "Возраст", field: "age", apiField: "age" },
    { label: "Пол", field: "gender", apiField: "gender" },
    { label: "Телефон", field: "phone", apiField: "phone" },
    { label: "Email", field: "email", apiField: "email" },
    { label: "Страна", field: "address.country" },
    { label: "Город", field: "address.city" },
  ];

const [searchFields, setSearchFields] = useState(
  Object.fromEntries(
    columns.map((c) => [
      c.field,
      c.field === "lastName" || c.field === "firstName" || c.field === "maidenName",
    ])
  )
);

  function getFieldValue(user, field) {
    return field.split(".").reduce((obj, key) => obj?.[key], user);
  }

  useEffect(() => {
    async function load() {
      const data = await fetchUsers({
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        sortBy: sortField,
        order: sortOrder,
      });

      setUsers(data.users);
      setTotal(data.total);
    }

    load();
  }, [page, rowsPerPage, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(0);
  };

  const filteredUsers = users.filter((user) => {
    if (!searchText) return true;

    return Object.keys(searchFields)
      .filter((f) => searchFields[f])
      .some((field) => {
        const value = getFieldValue(user, field);
        return value
          ? String(value).toLowerCase().includes(searchText.toLowerCase())
          : false;
      });
  });

  return (
    <>
      <Stack spacing={2} mb={2}>
        <TextField
          label="Фильтр"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
        />

        <FormGroup row>
          {columns.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={searchFields[col.field]}
                  onChange={() =>
                    setSearchFields((prev) => ({
                      ...prev,
                      [col.field]: !prev[col.field],
                    }))
                  }
                />
              }
              label={col.label}
            />
          ))}
        </FormGroup>
      </Stack>
      <Paper sx={{maxWidth: 1400, width: "100%",margin: "0 auto", minWidth: 800 }}>
        <TableContainer sx={{ minHeight: 300, width: "100%" }}>
          <Table stickyHeader sx={{ width: "100%", tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ whiteSpace: "nowrap" }}>
                    {col.apiField ? (
                      <TableSortLabel
                        active={sortField === col.apiField}
                        direction={sortField === col.apiField ? sortOrder : "asc"}
                        onClick={() => handleSort(col.apiField)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => setSelectedUser(user)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        sx={{
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                          maxWidth:
                            col.field === "email" || col.field === "address.country"
                              ? 180
                              : "auto",
                        }}
                      >
                        {getFieldValue(user, col.field)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow sx={{ height: 200 }}>
                  <TableCell colSpan={columns.length} align="center">
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Paper>
      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Детали пользователя</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={selectedUser.image}
                sx={{ width: 100, height: 100 }}
              />
              <Typography variant="h6">
                {selectedUser.lastName} {selectedUser.firstName}{" "}
                {selectedUser.maidenName}
              </Typography>
              <Typography>Возраст: {selectedUser.age}</Typography>
              <Typography>Пол: {selectedUser.gender}</Typography>
              <Typography>Телефон: {selectedUser.phone}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>
                Адрес: {selectedUser.address.country},{" "}
                {selectedUser.address.city},{" "}
                {selectedUser.address.street}
              </Typography>
              <Typography>Рост: {selectedUser.height} см</Typography>
              <Typography>Вес: {selectedUser.weight} кг</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}