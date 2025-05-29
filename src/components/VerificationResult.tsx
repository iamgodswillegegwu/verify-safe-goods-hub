
import { CheckCircle, AlertTriangle, Calendar, Shield, Building, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const VerificationResult = ({ result }) => {
  const {
    productName,
    isVerified,
    manufacturer,
    registrationDate,
    certificationNumber,
    similarProducts = []
  } = result;

  return (
    <Card className={`border-2 ${isVerified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader className={`${isVerified ? 'bg-green-100' : 'bg-orange-100'} rounded-t-lg`}>
        <CardTitle className="flex items-center gap-3">
          {isVerified ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          )}
          <span className={isVerified ? 'text-green-800' : 'text-orange-800'}>
            {isVerified ? 'Product Verified ✓' : 'Product Not Verified ⚠️'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Product Details */}
        <div>
          <h3 className="font-semibold text-lg text-slate-800 mb-3">{productName}</h3>
          
          {isVerified ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Safe
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Manufacturer:</span>
                  <span className="font-medium">{manufacturer}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Registered:</span>
                  <span className="font-medium">{new Date(registrationDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Certificate:</span>
                  <span className="font-medium">{certificationNumber}</span>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
                <p className="text-green-700 text-sm">
                  This product has been verified as authentic and safe for consumption. 
                  It meets all regulatory standards and is registered with authorized manufacturers.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Not Verified
                </Badge>
              </div>

              <div className="bg-orange-100 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">⚠️ Warning</h4>
                <p className="text-orange-700 text-sm mb-3">
                  This product was not found in our verified database or has different manufacturer information 
                  than registered. Please exercise caution before use.
                </p>
                <p className="text-orange-600 text-xs">
                  Consider contacting the manufacturer directly or consulting with relevant authorities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Similar/Recommended Products */}
        {similarProducts.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {isVerified ? 'Related Products' : 'Recommended Verified Alternatives'}
              </h4>
              
              <div className="space-y-2">
                {similarProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.manufacturer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.verified && (
                        <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
            Share Result
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 flex-1">
            Report Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationResult;
