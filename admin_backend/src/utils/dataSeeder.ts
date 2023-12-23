import { faker } from "@faker-js/faker";
import { env } from "@/utils/validateEnv";
import { ShortendUrlModel, UserModel, StatModel } from "@/models";
import stripe from "@/config/stripe";
import { SubscriptionModel } from "@/models/subscription.model";

export const resetAllData = async () => {
  await resetDatabase();
  const stripeCustomers = await stripe.customers.list();
  await stripe.customers.del(stripeCustomers.data[0].id);
};

export const resetDatabase = async () => {
  await UserModel.deleteMany({});
  await ShortendUrlModel.deleteMany({});
  await StatModel.deleteMany({});
  await SubscriptionModel.deleteMany({});
};

export const seedFakeData = async () => {
  if (env.NODE_ENV !== "development") return;
};

// import { faker } from "@faker-js/faker";
// import { UserModel, MessageModel, RoomModel } from "../models";

// const seedFakeData = async () => {
//   await UserModel.deleteMany({});
//   await RoomModel.deleteMany({});
//   await MessageModel.deleteMany({});
//   const createUsers = async () => {
//     const users = Array.from({ length: 9 }, () => ({
//       name: faker.person.fullName(),
//       email: faker.internet.email().toLowerCase(),
//       password: "123456",
//       profilePic: faker.image.avatar(),
//     }));

//     const insertedUser = await UserModel.insertMany([
//       {
//         name: "Jeet Chawda",
//         email: "jeetchawda@gmail.com".toLowerCase(),
//         password: "123456",
//         profilePic: faker.image.avatar(),
//       },
//       ...users,
//     ]);
//     return insertedUser;
//   };

//   const users = await createUsers();

//   const generateMessages = (participantsArr: any, roomId: string) => {
//     return Array.from({ length: 30 }, () => ({
//       sender:
//         participantsArr[Math.floor(Math.random() * participantsArr.length)],
//       roomId,
//       value: faker.lorem.sentence(),
//       type: "text",
//     }));
//   };

//   const createRooms = async (users: any) => {
//     const AllUsersId = users.map((user: any) => user._id);
//     const generateFakeGroupRooms = () => {
//       return {
//         name: faker.company.name(),
//         participants: [...AllUsersId],
//         admin: AllUsersId[Math.floor(Math.random() * AllUsersId.length)],
//         type: "group",
//         createdBy: AllUsersId[Math.floor(Math.random() * AllUsersId.length)],
//         profilePic: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
//       };
//     };

//     const generateFakePersonalRooms = () => {
//       const otherUsers = users.slice(1);
//       return {
//         name: faker.company.name(),
//         participants: [
//           users[0],
//           otherUsers[Math.floor(Math.random() * otherUsers.length)],
//         ],
//         admin: AllUsersId[Math.floor(Math.random() * AllUsersId.length)],
//         type: "personal",
//         createdBy: users[0]._id,
//         profilePic: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
//       };
//     };
//     for (let i = 0; i < 10; i++) {
//       const roomInfo =
//         i < 5 ? generateFakeGroupRooms() : generateFakePersonalRooms();
//       const createdRoom = await RoomModel.create(roomInfo);
//       await UserModel.updateMany(
//         { _id: createdRoom.participants },
//         {
//           $push: { rooms_joined: createdRoom._id },
//         }
//       );
//       const messages = generateMessages(
//         createdRoom.participants,
//         createdRoom._id.toString()
//       );
//       const insertedMessages = await MessageModel.insertMany(messages);
//       const messagesId = insertedMessages.map((el) => el._id.toString());
//       await RoomModel.findByIdAndUpdate(createdRoom._id, {
//         messages: messagesId,
//         recentMessage: messagesId[messagesId.length - 1],
//       });
//     }
//   };

//   const rooms = await createRooms(users);
// };

// export { seedFakeData };

// const rooms = [
//   ...generateFakeGroupRooms(),
//   ...generateFakePersonalRooms(),
// ];

// const insertedRooms = await RoomModel.create(rooms);
// insertedRooms.forEach(async (room) => {
//   const userId = room.participants?.map((user) => user._id);
//   await UserModel.updateMany(
//     { _id: userId },
//     {
//       $push: { rooms_joined: room._id },
//     }
//   );
// });
// return insertedRooms;
// const addMessages = async (users: any, rooms: any) => {
//   const AllUsersId = users.map((user: any) => user._id);
//   const AllRoomsId = rooms.map((room: any) => room._id);

//   const messages = Array.from({ length: 50 }, () => {
//     return {
//       sender: AllUsersId[Math.floor(Math.random() * AllUsersId.length)],
//       roomId: AllRoomsId[Math.floor(Math.random() * AllRoomsId.length)],
//       value: faker.lorem.sentence(),
//       type: "text",
//     };
//   });

//   const inserteddMessages = await MessageModel.insertMany(messages);
//   inserteddMessages.forEach(async (message) => {
//     await RoomModel.findByIdAndUpdate(message.roomId, {
//       $push: { messages: message._id },
//     });
//   });
//   return messages;
// };

// await addMessages(users, rooms);
