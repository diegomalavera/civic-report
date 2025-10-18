db = db.getSiblingDB("civic-report");

db.createUser({
  user: "civic-report-app",
  pwd: "PwYRzX99qn53",
  roles: [
    {
      role: "readWrite",
      db: "civic-report",
    },
  ],
});

db.createCollection("roles");

const adminRoleId = ObjectId();

db.roles.insertMany([
  {
    _id: adminRoleId,
    name: "Administrador",
    code: "admin",
    description: "Administrator de la plataforma.",
    permissions: [
      "roles_create",
      "roles_read",
      "roles_update",
      "roles_delete",
      "users_create",
      "users_read",
      "users_update",
      "users_delete",
      "reports_read",
      "user_update",
    ],
    enabled: true,
    protected: true,
    createdAt: new Date(),
  },
  {
    name: "Usuario",
    code: "user",
    description: "Usuario regular de la plataforma.",
    permissions: ["reports_read", "reports_create", "user_update"],
    enabled: true,
    protected: true,
    createdAt: new Date(),
  },
  {
    name: "Representante entidad",
    code: "agent",
    description: "Usuario representante de la entidad.",
    permissions: ["reports_read", "reports_update", "user_update"],
    enabled: true,
    protected: true,
    createdAt: new Date(),
  },
]);

db.createCollection("users");

db.users.insertOne({
  name: "Diego Fernando",
  lastName: "Malavera Lopez",
  email: "dmalaver@uniminuto.edu.co",
  password: "$2b$10$CVtWu634lIOUS.EqdoWaIOnkzIa3taJUWJIqzON6Lvt7NYT2AxXSG",
  enabled: true,
  protected: true,
  roleIds: [adminRoleId],
  createdAt: new Date(),
});
