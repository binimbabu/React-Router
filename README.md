**


React Router with data loading


install the following command

npm create vite@4

How to plan and build react application

1. Gather application requirements and features
2. Divide the application into pages
  2.1 Think about the overall and page level UI
  2.2 Break the desired UI into components
  2.3 Deign and buil a static version (no state yet)
3. Divide the application into feature categories
  3.1 Think about state management (what data to store and where to store data) + data flow
4. Decide on what libraries to use

Project requirements from the business

step 1:-

Here in this example users can order one or more pizzas from a menu
Requires no user accounts and no login users just input their names before using the app
The pizza menu can change so it should be loaded from an API
Users can add multiple pizzas to cart before ordering 
Ordering requires just the user name , phone number and address
GPS location should be provided to make delivery easier
Users can mark their order as priority for additional 20% of cart price
Orders made by sending a POST request with order data (user data + selected pizza) to API
Payment made on delivery no payment processing is necessary in the app.
Each order will get a unique ID that should be displayed so the user can later look up their order based on the ID.
Users should be able to mark as priority even after ordering.


Step 2 + step 3:- 

Features + Pages

feature categories:-
1. User
2. Menu
3. Cart
4. Order

Necessary Pages:-
1. Home page (/) - feature categories User linked to this page
2. Pizza Menu (/menu) - feature categories Menu linked to this page
3. Cart (/cart) - feature categories Cart linked to this page
4. Placing a new order (/order/new) - feature categories Order linked to this page
5. Looking up an order (/order/:orderID) - feature categories Order linked to this page


Step 3 + step 4:- 

1. User - one state slice related to User -> Global UI state (no accounts so stay in app)
2. Menu - one state slice related to Menu -> Global remote state (menu is fetched from API)
3. Cart -  one state slice related to Cart -> Global UI state (no need for API just stored in app)
4. Order - one state slice related to Order -> Global remote state (fetched and submitted to API)

Routing - react router
Styling - tailwindcss 
Remote state management -  react router  - fetching data inside react router - not state management as it doesn't persist state
Ui state management - Redux - state is complex.

remote state management we prefer to use React query instead of react router




In src create a folder 'feature' and inside 'feature' we create folders like cart, menu, user, order
In src create a folder 'ui', in the 'ui' folder we create buttons, inputs etc.
In src create a folder 'services' where e write reusable code for interacting with an API.
In src create a folder 'utils' where we write helper functions that are stateless which doesn't create side effects.



npm install react-router-dom@6

data fetching in react router we use 'createBrowserRouter'

import { createBrowserRouter } from 'react-router-dom' in 'App.jsx' folder.


'createBrowserRouter' is a function where we define all routes an do it passing an array of objects where each object is one route.




import Home from './ui/Home';
import Menu from './feature/menu/Menu';

const router = createBrowserRouter([
  {path:'/', element: <Home />},
  {path:'/menu', element: <Menu />}
])






App.jsx

import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './ui/Home';
import Menu from './feature/menu/Menu';
import Cart from './feature/cart/Cart';
import CreateOrder from './feature/order/CreateOrder';
import Order from './feature/order/Order';

const router = createBrowserRouter([
  {path:'/', element: <Home />},
  {path:'/menu', element: <Menu />},
  {path: "/cart", element: <Cart />},
  {path:'/order/new', element: <CreateOrder />},
  {path: '/order/:orderId', element: <Order />}
])

function App() {
  

  return (
   <RouterProvider router={ router} />
  )
}

export default App





here we are declaring the router outside of JSX and using javascript array. This is to data loading or data fetching or data submitting with 'createBrowserRouter'. 
To use powerful APIs like data loaders, data actions or data fetchers create new router using 'createBrowserRouter' and provide 'router' in  'RouterProvider' component.

Built layout so we can connect with Router. this application we are going  to build for both large and small screens. Create a header with name to the company and link to homepage along with the username. Main page must be pizza menu or current cart view that displays how many items in the cart and link to cart (these are accessible from everywhere in the application , here we put in 'AppLayout.jsx'). So cart and header will be part of the layout. The amin portion of the page changes it can be menu, form, cart items listed.

Create file AppLayout.jsx and Header.jsx in 'ui' folder




AppLayout.jsx


import Header from "./Header";

export default function AppLayout(){
    return (
        <div>
           <Header /> 
           <main>
            <h1>Content</h1>
           </main>
        </div>
    )
}




Header.jsx


import { Link } from "react-router-dom";

export default function Header(){

    return (
        <header>
         <Link to='/'>Fast React Pizza Co.</Link>
        </header>
    )
}


nested routes can be provided by 'children' property in 'createBrowserRouter'. '{element: <AppLayout />} given inside 'createBrowserRouter' since its there in every page we dont give the path (since we dont give path to AppLayout we call it as 'layout route') and all other are 'children' routes.


const router = createBrowserRouter([
  {element: <AppLayout /> , children: [
    {path:'/', element: <Home />},
  {path:'/menu', element: <Menu />},
  {path: "/cart", element: <Cart />},
  {path:'/order/new', element: <CreateOrder />},
  {path: '/order/:orderId', element: <Order />}
  ]} 
  
])

when we click the cart link cart content should come and so in other page for the main content.
Render the content of nested route inside another route by providing <Outlet />



AppLayout.jsx

import CartOverview from "../feature/cart/CartOverview";
import Header from "./Header";

export default function AppLayout(){
    return (
        <div>
           <Header /> 
           <main>
            <h1>Content</h1>
            <Outlet />
           </main>
           <CartOverview />
        </div>
    )
}

AppLayout is the parent route of every single other route that we have in the application, hence we put all other routes as children in AppLayout in createBrowserRouter.


react routers data loading feature called loaders. When we create a function that fetches data from an API, we provide loader function to one of our routes and that route will fetch data as soon as application goes to that route and when data has arrived it will be provided to page component itself using custom hook.
Here we want to fetch the menu data we can do this by 3 steps : - first we create a loader, we provide a loader and provide data to the page. Since we want to load the Menu data  we place loader inside the 'Menu' component. Here the 'loader' function where the 'loader' function here fetch the data and return it.

In 'services' folder in 'apiRestaurant.js' file we call 'getMenu' in the 'loader' function to fetch the menu data.



Menu.jsx

import {getMenu} from "../../services/apiRestaurant"

function Menu() {
  return <h1>Menu</h1>;
}

export async function loader() {
  const menu = await getMenu()
  return menu;
}

export default Menu;


In App.jsx we rename loader as menuLoader like below :-

import Menu, {loader as menuLoader} from './feature/menu/Menu';


App.jsx

const router = createBrowserRouter([
  {element: <AppLayout /> , children: [
    {path:'/', element: <Home />},
  {path:'/menu', element: <Menu />, loader: menuLoader},
  {path: "/cart", element: <Cart />},
  {path:'/order/new', element: <CreateOrder />},
  {path: '/order/:orderId', element: <Order />}
  ]} 
  



In App.jsx full code


import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './ui/Home';
import Menu, {loader as menuLoader} from './feature/menu/Menu';
import Cart from './feature/cart/Cart';
import CreateOrder from './feature/order/CreateOrder';
import Order from './feature/order/Order';
import AppLayout from './ui/AppLayout'

const router = createBrowserRouter([
  {element: <AppLayout /> , children: [
    {path:'/', element: <Home />},
  {path:'/menu', element: <Menu />, loader: menuLoader},
  {path: "/cart", element: <Cart />},
  {path:'/order/new', element: <CreateOrder />},
  {path: '/order/:orderId', element: <Order />}
  ]} 
  
])

function App() {
  

  return (
   <RouterProvider router={ router} />
  )
}

export default App



After we want to have data in component using custom hook called 'useLoaderData'.



Menu.jsx

import { useLoaderData } from "react-router-dom";
import {getMenu} from "../../services/apiRestaurant"

function Menu() {
  const menu = useLoaderData();
  console.log(menu)
  return <h1>Menu</h1>;
}

export async function loader() {
  const menu = await getMenu()
  return menu;
}

export default Menu;


React router will start fetching data at same time as it starts rendering current route
We can get loading state from useNavigation hook as shown below



AppLayout.jsx

import CartOverview from "../feature/cart/CartOverview";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";

export default function AppLayout(){
    const navigation = useNavigation();
    const loading = navigation.state === "loading";
    return (
        <div className="layout">
            {loading && <Loader />}
           <Header /> 
           <main>
            <h1>Content</h1>
            <Outlet />
           </main>
           <CartOverview />
        </div>
    )
}


Error page can be given as 'errorElement' in the parent layout element (here in AppLayout)
useRouteError() is a hook where we get the status and error of invalid route path

Header.jsx

import { Link } from "react-router-dom";
import SearchOrder from "../feature/order/SearchOrder";

export default function Header(){

    return (
        <header>
         <Link to='/'>Fast React Pizza Co.</Link>
         <SearchOrder />
        </header>
    )
}



SearchOrder.jsx


import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function SearchOrder(){
    const [query, setQuery] = useState("");
     var navigate = useNavigate();
    function handleSubmit(e){
        e.preventDefault();
        if(!query) return;
        navigate(`/order/${query}`);
        setQuery("")
    }
    return <form onSubmit={handleSubmit}>
        <input placeholder="Search Order ID" value={query} onChange={(e)=> setQuery(e.target.value)} />
    </form>
}


to get loader data we use 'useLoaderData()'




Order.jsx


// Test ID: IIDSAT

import { useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";



function Order() {
  var order = useLoaderData();
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div>
      <div>
        <h2>Status</h2>

        <div>
          {priority && <span>Priority</span>}
          <span>{status} order</span>
        </div>
      </div>

      <div>
        <p>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <div>
        <p>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}

export async function loader({params}) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;



Writing data with React router actions


Loaders are used to read data.
Action are used to mutate data or write data

When 'Form' from 'react-router-dom' is submitted then create a request that will intercepted by the action 'action' function (below) as soon as it is connected with React Router. When 'Form' submitted  React Router will call 'action' function  and will pass in request that was submitted, 'request.formData()' provided by the browser


CreateOrder.jsx


import { useState } from "react";
import { Form } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting'
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
           <button disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Order now'}</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({request}){
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = { ...data, cart: JSON.parse(data.cart), priority: data.priority === 'on'}
const errors={};
  if(!isValidPhone(order.phone)) errors.phone = "Please give us your correct phone number. We might need it to contact you"
  if(Object.keys(errors).length > 0) return errors;
  const newOrder = await createOrder(order)
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;




'Object.fromEntries(formData)' will get the formdata values entered in form. ' <input type="hidden" name="cart" value={JSON.stringify(cart)} />' will also add cart data inside the 'formValues' in 'action' function



App.jsx

import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './ui/Home';
import Menu, {loader as menuLoader} from './feature/menu/Menu';
import Cart from './feature/cart/Cart';
import CreateOrder,  {action as createOrderAction} from './feature/order/CreateOrder';
import Order, {loader as orderLoader} from './feature/order/Order';
import AppLayout from './ui/AppLayout';
import Error from './ui/Error'

const router = createBrowserRouter([
  {element: <AppLayout /> , errorElement: <Error />, children: [
    {path:'/', element: <Home />},
  {path:'/menu', element: <Menu />, loader: menuLoader},
  {path: "/cart", element: <Cart />},
  {path:'/order/new', element: <CreateOrder />, action: createOrderAction},
  {path: '/order/:orderId', element: <Order />, loader: orderLoader, errorElement: <Error />}
  ]} 
  
])

function App() {
  

  return (
   <RouterProvider router={ router} />
  )
}

export default App



When 'Form' on this path '/order/new' is submitted (here CreateOrder) then action thats specified will be called.





Error handling in Form actions

Since ' {path:'/order/new', element: <CreateOrder />, action: createOrderAction}' action is linked to 'CreateOrder' component all te values returned in the 'createOrderAction' function will be available in 'CreateOrder' using 'useActionData'.

CreateOrder.jsx

import { useState } from "react";
import { Form, redirect, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Order now'}</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({request}){
  const formData = await request.formData();
  const data = Object.fromEntries(formData)
  const order = { ...data, cart: JSON.parse(data.cart), priority: data.priority === 'on'};
  const errors={};
  if(!isValidPhone(order.phone)) errors.phone = "Please give us your correct phone number. We might need it to contact you"
  if(Object.keys(errors).length > 0) return errors;
  const newOrder = await createOrder(order);
  
  
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;

**













Tailwind CSS


Tailwind is a utility first cSS framework packed with utility classes like flex, text-center and rotate-90, among many other classes taht can be composed to build any design directly in your markup in HTML or JSX.
Utility first CSS write lots of tiny classes where each class has one single purpose and combine these classes to built entire components and layouts.


For vite project to install tailwind following commands

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p


Your tailwind.config.js must include the content array as follows

content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]



In index.css include the following on top

@tailwind base;
@tailwind components;
@tailwind utilities;


Home.jsx


function Home() {
  return (
    <div>
      <h1 className="text-xl text-yellow-500 font-semibold text-stone-700">
        The best pizza.
        <br />
        <span className="text-yellow-500">
 		Straight out of the oven, straight to you.
        </span>
      </h1>
    </div>
  );
}

export default Home;



'npm install -D prettier prettier-plugin-tailwindcss' will automatically sort the order of class name in the order with which tailwind recommends. 'font-semibold' denotes font weight as semibold.

In 'prettier.config.js' place the following

export default {
  "plugins": ["prettier-plugin-tailwindcss"]
}



' text-yellow-500' here text color set to yello with intensity 500. 'text-xl' text set to extra large.


export default function Username(){
    return (
        <div className="text-sm font-semibold">
            Bini Babu
        </div>
    )
}


'text-sm' text to smaller.



Header.jsx

import { Link } from "react-router-dom";
import SearchOrder from "../feature/order/SearchOrder";

export default function Header(){

    return (
        <header className="bg-yellow-200 px-4 py-3 border-b border-stone-600">
         <Link to='/' className="tracking-widest">Fast React Pizza Co.</Link>
         <SearchOrder />
         <Username />
        </header>
    )
}



'bg-yellow-200' bg denote backgroundcolor with yellow at intensity 200. 'tracking-widest' provides letter-spacing. 'tracking-[5px]' gives letter spacing of 5px. 'px-4'  denotes left and right padding 16px. 'py-3' denotes padding top and bottom 12px. 'border-b' denotes border at bottom and 'border-stone-600' denotes border color stone. 'border-b-8' 8 denotes  border width



CartOverview.jsx


import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div className="bg-stone-700 text-stone-200 uppercase p-4">
      <p className="space-x-4  font-semibold text-stone-300">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to='/cart'>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;



'bg-stone-700' set to background color to stone with intensity 700 and text color set to stone color with intensity 200. 'uppercase' transfers the text to uppercase. 'p-4' denotes padding to left, right, bottom, left to 16px. 'space-x-4 ' provides space of 16px horizontally.



Home.jsx


import CreateUser from '../feature/user/CreateUser'
function Home() {
  return (
    <div className='my-10 text-center'>
      <h1 className="text-xl font-semibold mb-4">
        The best pizza.
        <br />
        <span className="text-yellow-500">
 Straight out of the oven, straight to you.
        </span>
       
      </h1>
      <CreateUser />
    </div>
  );
}

export default Home;


mb-4 denotes margin bottom to 16px
mx-0 denotes margin left and margin right to 0px
my-0 denotes margin bottom and margin top to 0px



Responsive design Tailwind css

'sm' denotes minimum width of 640px, 'md' minimum width of 768px, 'lg' minimum width of 1024px, 'xl' minimum width of 1280px, '2xl' minimum width of 1536px

sm:my-16 denotes  minimum width of 640px of margin top and bottom of 64px when the width of screen below 640px then the default css will come into effect here in the bottom my-10


Home.jsx


import CreateUser from '../feature/user/CreateUser'
function Home() {
  return (
    <div className='my-10 text-center sm:my-16'>
      <h1 className="text-xl font-semibold  mb-8">
        The best pizza.
        <br />
        <span className="text-yellow-500">
 Straight out of the oven, straight to you.
        </span>
       
      </h1>
      <CreateUser />
    </div>
  );
}

export default Home;




Header.jsx


import { Link } from "react-router-dom";
import SearchOrder from "../feature/order/SearchOrder";
import Username from "../feature/user/Username";

export default function Header(){

    return (
        <header className="bg-yellow-200 px-4 py-3 border-b border-stone-600 sm:px-6">
         <Link to='/' className="tracking-widest">Fast React Pizza Co.</Link>
         <SearchOrder />
         <Username />
        </header>
    )
}




CartOverview.jsx

import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div className="bg-stone-700 text-stone-200 uppercase p-4 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to='/cart'>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;



'md:text-base' denotes when width of screen starts from 768px then the text is set base which means default.
'w-72' denotes width to 128px, 'h-10' to 40px



CreateUser.jsx


import { useState } from 'react';

function CreateUser() {
  const [username, setUsername] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className='mb-4 text-sm text-stone-600 md:text-base'>👋 Welcome! Please start by telling us your name:</p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)} className='w-72 h-10'
      />

      {username !== '' && (
        <div>
          <button>Start ordering</button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;






Flex tailwind CSS


'flex items-center justify-between' converts to flex using make 'flex' items center using 'items-center' and put space between items using 'justify-between' 


CartOverview.jsx


import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div className="flex items-center justify-between bg-stone-700 text-stone-200 uppercase p-4 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to='/cart'>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;



Header.jsx




Grid Tailwind CSS


To place footer to bottom of the screen we place 'grid' to home page so the header, main and footer section will be properly aligned.

'grid grid-rows-3 gap-4' placing grid of css with items in page placed in rows using 'grid-rows-3' where header, main and footer placed in 3 rows.

' h-screen grid-rows-[auto_1fr_auto]' here 'h-screen' takes the height of the screen of 100vh and 'grid-rows-[auto_1fr_auto]' here header and footer aligned rows of auto, main portionallocates maximum space of 1fr.

'overflow-scroll' will provide scroll to only main portion since 'overflow-scroll' given in main className.

max-w-3xl provides maximum width of 3xl in size even for smaller screen.



App.Layout.jsx

import CartOverview from "../feature/cart/CartOverview";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";

export default function AppLayout(){
    const navigation = useNavigation();
    const loading = navigation.state === "loading";
    return (
        <div className="grid h-screen grid-rows-[auto_1fr_auto] gap-4">
            {loading && <Loader />}
           <Header /> 
           <main className="overflow-scroll bg-red-400 max-w-3xl">
            <h1>Content</h1>
            <Outlet />
           </main>
           <CartOverview />
        </div>
    )
}
