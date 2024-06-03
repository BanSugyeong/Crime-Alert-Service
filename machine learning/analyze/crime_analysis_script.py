import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR

# 데이터 로드 (예시 경로, 실제 데이터 경로로 변경 필요)
weather_data = pd.read_csv('s_weather.csv', encoding='cp949')
crime_data = pd.read_csv('regression/crime_seoul_all.csv', encoding='cp949')

# 데이터 전처리: 필요한 열만 선택, 결측치 처리 등
# 여기서는 간단히 날씨 데이터와 범죄 데이터를 날짜 기준으로 결합
data = pd.merge(weather_data, crime_data, on='일시')

# 특성과 타겟 분리
X = data.drop('월_범죄건수', axis=1)
y = data['월_범죄건수']

# 데이터 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 여러 모델 훈련 및 평가
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(),
    'Support Vector Machine': SVR()
}

for name, model in models.items():
    model.fit(X_train, y_train)
    scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"{name} Accuracy: {scores.mean():.2f} +/- {scores.std():.2f}")

    # 테스트 데이터에 대한 예측 및 평가
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f"{name} Test MSE: {mse:.2f}")

# 최적의 모델 선택 및 하이퍼파라미터 튜닝 (예: RandomForest)
param_grid = {'n_estimators': [100, 200], 'max_features': ['auto', 'sqrt'], 'max_depth': [10, 20]}
grid_search = GridSearchCV(RandomForestRegressor(), param_grid, cv=5)
grid_search.fit(X_train, y_train)
print("Best parameters:", grid_search.best_params_)
print("Best cross-validation score: {:.2f}".format(grid_search.best_score_))
