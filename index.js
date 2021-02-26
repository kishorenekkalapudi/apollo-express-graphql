const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
var cors = require("cors");

// Some fake data
const resetData = [
  {
    dessert: "Oreo",
    nutritionInfo: { calories: 437, fat: 18, carb: 63, protein: 4 },
  },
  {
    dessert: "Nougat",
    nutritionInfo: { calories: 360, fat: 19, carb: 50, protein: 37 },
  },
];
let Desserts = [
  {
    dessert: "Oreo",
    nutritionInfo: { calories: 437, fat: 18, carb: 63, protein: 4 },
  },
  {
    dessert: "Nougat",
    nutritionInfo: { calories: 360, fat: 19, carb: 50, protein: 37 },
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    Desserts: [Dessert] 
}
  type Mutation {createDessert(dessert:String,calories: Int, fat:Int, carb:Int, protein:Int ):
  NewDessert
  deleteDessert(dessert:String):DelDessert
  }
  type DelDessert {dessert: String}
  type NewDessert { dessert: String, calories: Int, fat:Int, carb:Int, protein:Int }
  type Dessert { dessert: String, nutritionInfo: NutritionInfo }
  type NutritionInfo {calories: Int, fat:Int, carb:Int, protein:Int }
`;

// The resolvers
const resolvers = {
  Query: { Desserts: () => Desserts },
  Mutation: {
    createDessert: (parent, { dessert, fat, calories, carb, protein }) => {
      let available = false;
      Desserts.map((e, i) => {
        if (e.dessert === dessert) {
          available = true;
          e.nutritionInfo = { fat, calories, carb, protein };
        }
        return e;
      });
      const Dessert = { dessert, fat, calories, carb, protein };
      console.log(available);
      if (!available)
        Desserts.push({
          dessert,
          nutritionInfo: { fat, calories, carb, protein },
        });
      return Dessert;
    },
    deleteDessert: (parent, { dessert }) => {
      data = Desserts.filter((e, i) => {
        if (e.dessert !== dessert) {
          return e;
        }
      });
      Desserts = data;
      return dessert;
    },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();
app.use(cors());
// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3001, () => {
  console.log("Go to http://localhost:3001/graphiql to run queries!");
});
