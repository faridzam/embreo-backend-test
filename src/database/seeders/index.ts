import pool from "../../config/database";
import AccountSeeder from "./AccountSeeder";
import CompanySeeder from "./CompanySeeder";
import RoleSeeder from "./RoleSeeder";
import UserSeeder from "./UserSeeder";


const RunSeeder = async () => {
  await RoleSeeder();
  await CompanySeeder();
  await UserSeeder();
  await AccountSeeder();
}

RunSeeder().finally(() => pool.end())
