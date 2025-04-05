import { SoilDatabase } from "@/soil";
import { Data } from "@/soil/services/types";

export const isFromDbTypeGuard = <T2 extends keyof SoilDatabase>(data: SoilDatabase[T2] | Data<T2>): data is Data<T2> =>
  Boolean((data as Data<T2>).createdAt);
