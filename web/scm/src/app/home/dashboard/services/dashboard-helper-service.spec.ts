import { TestBed, async, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { DashboardHelperService } from './dashboard-helper.service';
import { BigQueryService } from '../../services/big-query/big-query.service';

class MockBigQueryService {
    public runQuery(query: string): Promise<gapi.client.Request<gapi.client.bigquery.QueryResponse>> {
        return Promise.resolve({
            result: null,
            execute: null,
            then: null,
            catch: null,
            finally: null,
            [Symbol.toStringTag]: null
        });
    }

    public convertResult(result: gapi.client.bigquery.QueryResponse) {
        return [
            {
                heatmap_layers: ['heatmap_layer'],
                shape_layers: ['shape_layer']
            }
        ];
    }
}

describe('DashboardHelperService', () => {
    let service: DashboardHelperService;
    let bigQueryService: MockBigQueryService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: BigQueryService, useClass: MockBigQueryService }
            ]
        });

        service = TestBed.inject(DashboardHelperService);
        bigQueryService = TestBed.inject(BigQueryService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getAdditionalLayers should get all additional layers', fakeAsync(() => {
        let flag = null;
        service.getAdditionalLayers()
        .then(
            layers => flag = layers
        );
        flushMicrotasks();
        expect(flag.heatmap).toEqual(['heatmap_layer']);
        expect(flag.shape).toEqual(['shape_layer']);
    }));

});
