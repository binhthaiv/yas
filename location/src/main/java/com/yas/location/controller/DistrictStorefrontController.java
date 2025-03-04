package com.yas.location.controller;

import com.yas.location.service.DistrictService;
import com.yas.location.viewmodel.district.DistrictGetVm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DistrictStorefrontController {
    private final DistrictService districtService;

    @GetMapping("/storefront/district/{id}")
    public ResponseEntity<List<DistrictGetVm>> getList(@PathVariable Long id) {
        return ResponseEntity.ok(districtService.getList(id));
    }
}
