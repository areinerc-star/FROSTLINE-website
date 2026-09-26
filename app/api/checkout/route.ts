import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cart, paymentMethod, email, referenceNumber } = body

    const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY

    // If PayMongo Secret Key is provided in environment variables, trigger automated payment creation
    if (paymongoSecretKey && paymentMethod === 'gcash') {
      const response = await fetch('https://api.paymongo.com/v1/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(paymongoSecretKey + ':').toString('base64')}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              type: 'gcash',
              amount: Math.round(
                (cart.reduce((sum: number, item: { price: number }) => sum + item.price, 0) + 150) * 100
              ),
              currency: 'PHP',
              redirect: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?payment=success`,
                failed: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?payment=failed`,
              },
            },
          },
        }),
      })

      const paymongoData = await response.json()
      if (paymongoData?.data?.attributes?.redirect?.checkout_url) {
        return NextResponse.json({
          success: true,
          redirectUrl: paymongoData.data.attributes.redirect.checkout_url,
        })
      }
    }

    // Default response for local checkout flow
    const orderId = 'FRL-' + Math.floor(100000 + Math.random() * 900000)
    return NextResponse.json({
      success: true,
      orderId,
      email,
      paymentMethod,
      referenceNumber,
    })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to process checkout' }, { status: 500 })
  }
}
