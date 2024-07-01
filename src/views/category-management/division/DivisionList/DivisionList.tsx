import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTable from './components/DivisionTable'
import ProductTableTools from './components/ProductTableTools'
import DivisionTable from './components/DivisionTable'

injectReducer('salesProductList', reducer)

const DivisionList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Division</h3>
                <ProductTableTools />
            </div>
            <DivisionTable />
        </AdaptableCard>
    )
}

export default DivisionList
