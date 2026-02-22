export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId: string }>;
}) {
    const { orderId } = await searchParams;

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold font-heading mb-4 text-neutral-dark">Order Placed Successfully!</h1>
            <p className="text-neutral-500 mb-8">
                Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-neutral-dark">#{orderId}</span>.
            </p>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                We will contact you shortly to confirm shipping details.
            </p>
            <a href="/" className="btn-premium bg-brand-red text-white hover:bg-brand-red-dark">
                Back to Home
            </a>
        </div>
    );
}
