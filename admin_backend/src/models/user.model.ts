import {
  prop,
  pre,
  modelOptions,
  getModelForClass,
  Ref,
  DocumentType,
} from "@typegoose/typegoose";
import { IsEmail, MinLength, MaxLength } from "class-validator";
import bcrypt from "bcryptjs";
import { ShortendUrl } from "@shared/models/shortend_url.model"; // Assuming you have a ShortendUrl model

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@pre<User>("save", async function (this: DocumentType<User>) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})
export class User {
  @prop({ required: true, minlength: 3, maxlength: 50 })
  @MinLength(3)
  @MaxLength(50)
  public name!: string;

  @prop({ required: true, unique: true })
  @IsEmail()
  public email!: string;

  @prop({ required: true })
  public profile_img!: string;

  @prop({ required: true, minlength: 6 })
  @MinLength(6)
  public password!: string;

  @prop({ ref: () => ShortendUrl, default: [] })
  public generated_links!: Ref<ShortendUrl>[];

  @prop({ ref: () => ShortendUrl, default: [] })
  public favorites!: Ref<ShortendUrl>[];

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
