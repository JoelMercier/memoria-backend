import { User } from "@/entities/User";
import { IMemoryRW } from "../IMemoryRW";
import { IUserData } from "../../entities/user/IUserData";
import { UserId } from "@/domain/value-objects/ids";


/**
 * 🎰 Interface IMockUserRepository 🧮 [DÉCOUPAGE PHYSIQUE V4]
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure volatile évitant l'injection obligatoire du pool PostgreSQL.
 * Marie les verbes métiers de lecture de tags à la persistance d'écriture en mémoire vive.
 *
 * @interface IMockUserRepository
 * @extends {IMemoryRW<User, IUserData, UserId>}
 */
export interface IMockUserRepository extends IMemoryRW<User, IUserData, UserId> {
  //
}
