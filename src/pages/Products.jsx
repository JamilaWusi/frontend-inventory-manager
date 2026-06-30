import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";

function Products() {
  return (
    <div className="p-6">
      <PageHeader
        title="Products"
        subtitle="Manage your products and inventory."
        buttonText="Add Product"
      />

      <div className="grid grid-cols-4 gap-6 my-6">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>

      <SearchBar />

      <ProductTable />
    </div>
  );
}

export default Products;