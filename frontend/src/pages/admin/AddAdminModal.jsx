await API.post("/api/admin/create-admin", {
    email,
    password,
  });
  onSuccess();
  onClose();
  