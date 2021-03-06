import React, { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { connect } from 'react-redux'
import styled from 'styled-components'
import logo from './stripelogo2.png'
import './Cart.css'


const Cart = props => {
const [ cartItems, setCartItems ] = useState([])

useEffect( () => {
   getCart()
}, [])

function getCart() {
   axios.get(`/api/cart/${props.user.customer_order_id}`)
   .then(items => setCartItems(items.data))
   .catch(err => console.log(err))
}

const remove = cart_id => {
   // ticker = ticker.split('/').join('-')
   axios.delete(`/api/removefromcart/${cart_id}`, )
   .then(() => getCart())
   .catch(err => console.log(err))
}


const onToken = (token) => {
   console.log('line 38 is: ', token)
   axios.post('/api/payment', { token, amount: (yourTotal*100).toFixed(), customer_order_id: props.user.customer_order_id, customer_id: props.user.customer_id, email: props.user.email })
   .then(res => {
      getCart()
      toast.success(`Congratulations you paid ${props.user.first_name} ${yourTotal}!`)
   })
   .catch(err => {
      toast.error('Error occured')
   })
 }

 const yourTotal = cartItems.reduce((a, b) => parseFloat(a) + parseFloat(b.total), 0); 

   return (
      <CartDiv>
         <ToastContainer position="top-right" autoClose={1200} hideProgressBar={false} newestOnTop={false}
         closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover />
         {console.log('this is: ', props.user.customer_id)}
         {cartItems.length < 1 ? 
            <h3> Your cart is empty </h3>
         :
         <table className="cart-table">
            <tr>
               <th>Type</th>
               <th>Qty</th>
               <th>purchased price</th>
               <th>Total</th>
               <th>Remove</th>
            </tr>
         {cartItems.map(item => (
           <tr key={item.cart_id}>
             <td> {item.ticker}</td>
             <td> {item.qty} </td>
             <td> {item.price} </td>
             <td> {item.total} </td>
             <td><button onClick={() => remove(item.cart_id)} >Remove</button>{" "}</td>
           </tr>
         ))}
         <tfoot>
           <tr>
             <td colSpan="5"> <h3> Your total is: ${yourTotal.toFixed(2)} </h3> </td>
           </tr>
         </tfoot>
       </table>
      }

         <StripeCheckout style={{position: 'fixed', bottom: '10px'}}
          name='bankname' //header
         //  image={imageUrl}
          description='making a payment' //subtitle - beneath header
          stripeKey={process.env.REACT_APP_STRIPE_KEY} //public key not secret key
          token={onToken} //fires the call back
          amount={yourTotal*100} //this will be in cents
         //  currency="USD" 
          image={logo} // the pop-in header image (default none)
          // ComponentClass="div" //initial default button styling on block scope (defaults to span)
          panelLabel="Submit Payment" //text on the submit button
         //  locale="en" //locale or language (e.g. en=english, fr=french, zh=chinese)
         //  opened={onOpened} //fires cb when stripe is opened
         //  closed={onClosed} //fires cb when stripe is closed
          allowRememberMe={true} // "Remember Me" option (default true)
          billingAddress={false}
          // shippingAddress //you can collect their address
          zipCode={false}
        >
          {/* <button>Checkout</button> */}
        </StripeCheckout>

      </CartDiv>
   )
}

function mapStateToProps (state) {
   return {
      user: state.userReducer.user
   }
}

export default connect(mapStateToProps)(Cart); 

const CartDiv = styled.div`
   width: 100%
   margin: auto; 
`;


const CartItem = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between; 
   align-items: center; 
   max-width: 80vw; 
   margin: auto; 
`;

const imageUrl = 'https://sapience.com.au/images/icons/super-and-investing.png'