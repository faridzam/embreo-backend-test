import pool from "../../config/database";
import { AccountMigration } from "./AccountMigration";
import { CompanyMigration } from "./CompanyMigration";
import { EventDateMigration } from "./EventDateMigration";
import { EventMigration } from "./EventMigration";
import { EventVendorMigration } from "./EventVendorMigration";
import { RoleMigration } from "./RoleMigration";
import { UserMigration } from "./UserMigration";

const RunMigration = async () => {
  await RoleMigration();
  await CompanyMigration();
  await UserMigration();
  await AccountMigration();
  await EventMigration();
  await EventVendorMigration();
  await EventDateMigration();
}
RunMigration().finally(() => pool.end())