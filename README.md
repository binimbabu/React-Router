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
