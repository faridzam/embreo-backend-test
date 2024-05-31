import pool from "../../config/database";
import AccountSeeder from "./AccountSeeder";
import UserSeeder from "./UserSeeder";
import CompanySeeder from "./companySeeder";
import RoleSeeder from "./roleSeeder";


const RunSeeder = async () => {
  await RoleSeeder();
  await CompanySeeder();
  await UserSeeder();
  await AccountSeeder();
}

RunSeeder().finally(() => pool.end())
