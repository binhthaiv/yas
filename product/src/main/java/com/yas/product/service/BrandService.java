package com.yas.product.service;

import com.yas.product.exception.DuplicatedException;
import com.yas.product.exception.NotFoundException;
import com.yas.product.model.Brand;
import com.yas.product.repository.BrandRepository;
import com.yas.product.utils.Constants;
import com.yas.product.viewmodel.brand.BrandListGetVm;
import com.yas.product.viewmodel.brand.BrandPostVm;
import com.yas.product.viewmodel.brand.BrandVm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BrandService {
    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public BrandListGetVm getBrands(int pageNo, int pageSize) {
        List<BrandVm> brandVms = new ArrayList<>();
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Brand> brandPage = brandRepository.findAll(pageable);
        List<Brand> brandList = brandPage.getContent();
        for (Brand brand : brandList) {
            brandVms.add(BrandVm.fromModel(brand));
        }

        return new BrandListGetVm(
            brandVms,
            brandPage.getNumber(),
            brandPage.getSize(),
            (int) brandPage.getTotalElements(),
            brandPage.getTotalPages(),
            brandPage.isLast()
        );
    }

    public Brand create(BrandPostVm brandPostVm) {
        validateExistedName(brandPostVm.name(), null);

        return brandRepository.save(brandPostVm.toModel());
    }

    public Brand update(BrandPostVm brandPostVm, Long id) {
        validateExistedName(brandPostVm.name(), id);

        Brand brand = brandRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(Constants.ERROR_CODE.BRAND_NOT_FOUND, id));
        brand.setSlug(brandPostVm.slug());
        brand.setName(brandPostVm.name());
        brand.setIsPublished(brandPostVm.isPublish());

        return brandRepository.save(brand);
    }

    private void validateExistedName(String name, Long id) {
        if (checkExistedName(name, id)) {
            throw new DuplicatedException(Constants.ERROR_CODE.NAME_ALREADY_EXITED, name);
        }
    }

    private boolean checkExistedName(String name, Long id) {
        return brandRepository.findExistedName(name, id) != null;
    }
}
