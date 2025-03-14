import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CatregoriesTable from "../../components/categories/CatregoriesTable";

const CatregoriesPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <CatregoriesTable />
        <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
        </div>
      </main>
    </div>
  );
};
export default CatregoriesPage;
