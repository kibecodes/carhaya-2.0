
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return ( 
        <div className="flex h-[100vh] w-screen justify-center items-center">
            {children}
        </div>
    );
}

export default AuthLayout;