import { Injectable, Injector } from "@angular/core";
import { EMPTY, Observable, of } from "rxjs";
import { ApiService } from "../../core/api.service";
import { catchError, switchMap, tap } from "rxjs/operators";
import { NotificationService } from "../../core/notification.service";

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector, private readonly notificationService: NotificationService) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled("import")) {
      console.warn(
        "Endpoint \"import\" is disabled. To enable change your environment.ts config"
      );
      return EMPTY;
    }

    console.log('uploadProductsCSV file', file);

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) => this.http.put(url, file, {
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "Content-Type": "text/csv",
            }
          })
      ),
      catchError(error => {
        const {message} = error;

        console.log(error);
        this.notificationService.showError(
          `${message} `,
          0
        );
        return of(false);
      })
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const url = this.getUrl("import", "import")
    console.log('fileName => ', fileName);

    return this.http.get<string>(url, {
      params: {
        name: fileName
      },
    });
  }
}
