import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
// import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
// import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../../components/products/ProductsTable";

const ProductsPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
   
    

        <ProductsTable />

        {/* CHARTS */}
        <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
          {/* <SalesTrendChart />
          <CategoryDistributionChart /> */}
        </div>
      </main>
    </div>
  );
};
export default ProductsPage;
