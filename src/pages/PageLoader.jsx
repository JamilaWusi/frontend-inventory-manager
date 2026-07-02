import Loader from "../components/Loader";

export default function PageLoader() {
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
            <Loader />
        </div>
    )
}