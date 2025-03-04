import type { NextPage } from 'next';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import ModalDeleteCustom from '@commonItems/ModalDeleteCustom';
import type { TaxClass } from '@taxModels/TaxClass';
import { handleDeletingResponse } from '@commonServices/ResponseStatusHandlingService';
import { deleteTaxClass, getPageableTaxClasses } from '@taxServices/TaxClassService';
import { TAX_CLASS_URL, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from 'constants/Common';

const TaxClassList: NextPage = () => {
  const [taxClassIdWantToDelete, setTaxClassIdWantToDelete] = useState<number>(-1);
  const [taxClassNameWantToDelete, setTaxClassNameWantToDelete] = useState<string>('');
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [taxClasses, setTaxClasses] = useState<TaxClass[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState<number>(DEFAULT_PAGE_NUMBER);
  const [totalPage, setTotalPage] = useState<number>(1);

  const handleClose: any = () => setShowModalDelete(false);
  const handleDelete: any = () => {
    if (taxClassIdWantToDelete == -1) {
      return;
    }
    deleteTaxClass(taxClassIdWantToDelete).then((response) => {
      setShowModalDelete(false);
      handleDeletingResponse(response, taxClassNameWantToDelete);
      setPageNo(DEFAULT_PAGE_NUMBER);
      getListTaxClass();
    });
  };
  const getListTaxClass = () => {
    getPageableTaxClasses(pageNo, DEFAULT_PAGE_SIZE).then((data) => {
      setTotalPage(data.totalPages);
      setTaxClasses(data.taxClassContent);
      setLoading(false);
    });
  };
  useEffect(() => {
    setLoading(true);
    getListTaxClass();
  }, [pageNo]);

  const changePage = ({ selected }: any) => {
    setPageNo(selected);
  };
  if (isLoading) return <p>Loading...</p>;
  if (!taxClasses) return <p>No Tax Class</p>;
  return (
    <>
      <div className="row mt-5">
        <div className="col-md-8">
          <h2 className="text-danger font-weight-bold mb-3">Tax Class</h2>
        </div>
        <div className="col-md-4 text-right">
          <Link href={`${TAX_CLASS_URL}/create`}>
            <Button>Create Tax Class</Button>
          </Link>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {taxClasses.map((taxClass) => (
            <tr key={taxClass.id}>
              <td>{taxClass.id}</td>
              <td>{taxClass.name}</td>
              <td>
                <Link href={`${TAX_CLASS_URL}/${taxClass.id}/edit`}>
                  <button className="btn btn-outline-primary btn-sm" type="button">
                    Edit
                  </button>
                </Link>
                &nbsp;
                <button
                  className="btn btn-outline-danger btn-sm"
                  type="button"
                  onClick={() => {
                    setShowModalDelete(true);
                    setTaxClassIdWantToDelete(taxClass.id);
                    setTaxClassNameWantToDelete(taxClass.name);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalDeleteCustom
        showModalDelete={showModalDelete}
        handleClose={handleClose}
        nameWantToDelete={taxClassNameWantToDelete}
        handleDelete={handleDelete}
        action="delete"
      />
      <ReactPaginate
        forcePage={pageNo}
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={totalPage}
        onPageChange={changePage}
        containerClassName={'paginationBtns'}
        previousLinkClassName={'previousBtn'}
        nextClassName={'nextBtn'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'paginationActive'}
      />
    </>
  );
};

export default TaxClassList;
